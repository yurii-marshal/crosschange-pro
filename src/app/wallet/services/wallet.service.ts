import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'shared-kuailian-lib';
import { IWallet } from '../../shared/interfaces/wallet.interface';
import { map, share, tap } from 'rxjs/operators';
import { IApiResponse } from 'shared-kuailian-lib';
import { HttpParams } from '@angular/common/http';
import { Cacheable } from 'ngx-cacheable';

export interface IUserBalance {
  available_balance: number;
  total_balance: number;
  total_balance_eur: number;
}

export interface IEuroBalance {
  account_balance_btc: number;
  account_balance_eur: number;
  account_id: string;
  frozen_balance_btc: number;
  frozen_balance_eur: number;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService extends ApiService {

  private wallets: IWallet[] | null = null;

  constructor(
    protected injector: Injector,
  ) {
    super(injector);
  }

  getWallets(refresh = false): Observable<IWallet[]> {

    if (this.wallets && !refresh) {
      return of(this.wallets);
    }

    return super.get<IApiResponse<IWallet>>('spot-wallets', {offset: 0, limit: 100}).pipe(
      tap((v) => {
        this.wallets = v.results;
      }),
      map(v => {
        return v.results;
      }),
      share()
    );
  }

  @Cacheable({
    maxAge: 5 * 60 * 1000,
  })
  getCryptoPairs(): Observable<any> {
    return super.get('exchanges/pair-list');
  }

  getWalletBalance(userId: string): Observable<IUserBalance> {
    return super.get(`spot-wallets/users/${userId}/balances/general`);
  }

  getWalletsList(params: any): Observable<any> {
    let parameters = new HttpParams();

    parameters = parameters
      .set('offset', params.offset)
      .set('limit', params.limit)
      .set('search', params.search)
      .set('hideLowBalance', params.hideLowBalance);

    return super.get('spot-wallets', {params: parameters});
  }

  @Cacheable({
    maxAge: 5 * 60 * 1000,
  })
  getEuroAccountList(params: any): Observable<any> {
    let parameters = new HttpParams();

    parameters = parameters
      .set('offset', params.offset)
      .set('limit', params.limit);

    return super.get('spot-wallets/users/balances/euro-account', {params: parameters})
      .pipe(
        map((res: IEuroBalance) => {
          return {
            count: 1,
            results: [{
              cryptocurrency: 'EUR',
              balance: {
                total: res.account_balance_eur + res.frozen_balance_eur,
                available: res.account_balance_eur,
                in_order: res.frozen_balance_eur,
                btc: res.account_balance_btc + res.frozen_balance_btc,
              },
            }]
          };
        }),
        share(),
      );
  }
}
