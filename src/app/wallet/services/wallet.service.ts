import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'shared-kuailian-lib';
import { IWallet } from '../../shared/interfaces/wallet.interface';
import {
  ITransactionItem,
  TransactionStatus,
  TransactionType,
} from '../../shared/interfaces/transaction-item.interface';
import { IApiResponse } from 'shared-kuailian-lib';
import { map, share, shareReplay } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { RequestCacheService } from '../../core/services/request-cache.service';

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


const depositsMock: IApiResponse<ITransactionItem> = {
  count: 50,
  next: '',
  previous: '',
  results: new Array(10).fill({
    date: new Date().toString(),
    cryptocurrency: 'btc',
    amount: 1,
    status: TransactionStatus.NEW,
    tx_hash: '234jl6k23j4kl6j2346j',
    type: TransactionType.DEPOSIT
  })
};

export interface IDepositHistoryRequest {
  cryptocurrency: string;
  offset?: number;
  limit?: number;
  ordering?: string;
}

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

  private deposits: IApiResponse<ITransactionItem> = {
    count: 0,
    next: '',
    previous: '',
    results: []
  };

  constructor(
    protected injector: Injector,
    private requestCacheService: RequestCacheService,
    ) {
    super(injector);
    this.requestCacheService.addToCache('exchanges/pair-list/');
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

  getDepositHistory(params: IDepositHistoryRequest): Observable<IApiResponse<ITransactionItem>> {
    if (!params.cryptocurrency || !('offset' in params) || !('limit' in params)) {
      return of(this.deposits);
    }
    // TODO: UNCOMMENT WHEN API IS READY
    /*const req = {
      type: 'deposit',
        ...params
    };
    return super.get<IApiResponse<ITransactionItem>>(`transactions`, req).pipe(share());*/

    // TODO: DELETE WHEN API IS READY
    depositsMock.results = depositsMock.results.map(v => {
      v.cryptocurrency = params.cryptocurrency;
      return v;
    });
    this.deposits = depositsMock;
    return of(this.deposits);
  }

  getPairs(coinType: string): Observable<string[]> {
    return super.get('exchanges/pair-list')
      .pipe(
        map((res: string[]) => res.filter(pair => pair.split('/')[0] === coinType.toUpperCase())),
        shareReplay(1),
      );
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
