import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'shared-kuailian-lib';
import { IWallet } from '../../shared/interfaces/wallet.interface';
import { share } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Cacheable } from 'ngx-cacheable';

// TODO: DELETE WHEN API IS READY
const walletMock = {
  cryptocurrency: 'btc',
  address: '36KunwNiXhDy6bjJvUqeSMzgCZzfZBksid',
  tag: '',
  id: 0,
  balance: {
    total: 0,
    available: 0,
    in_order: 0,
    btc: 0
  },
};

// TODO: DELETE WHEN API IS READY
const walletsMock = ['ETH', 'XRP', 'BTC', 'LTC', 'BCH', 'DASH', 'USDT', 'USDC', 'XTZ'].map((v, i) => {
  const val = {...walletMock};
  val.cryptocurrency = v.toLowerCase();
  val.address += i + '';
  if (val.cryptocurrency === 'xrp') {
    val.tag = '0x4yiuwyuy4749';
  }
  return val;
});


export interface IUserBalance {
  available_balance: number;
  total_balance: number;
  total_balance_eur: number;
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

    // TODO: UNCOMMENT WHEN API IS READY
    /*return super.get<IApiResponse<IWallet>>('spot-wallets', {offset: 0, limit: 100}).pipe(
      tap((v) => {
        this.wallets = v.results;
      }),
      map(v => {
        return v.results;
      }),
      share()
    );*/

    // TODO: DELETE WHEN API IS READY
    this.wallets = walletsMock;
    return of(this.wallets).pipe(share());
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
}
