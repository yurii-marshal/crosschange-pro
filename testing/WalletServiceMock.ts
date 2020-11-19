import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TradeType } from '../src/app/core/interfaces/trade-type.interface';
import { Memoized } from '../src/app/core/decorators/memoized.decorator';
import { IWallet } from '../src/app/shared/interfaces/wallet.interface';
import {
  ITransactionItem,
  TransactionStatus,
  TransactionType
} from '../src/app/shared/interfaces/transaction-item.interface';
import { IApiResponse } from 'shared-kuailian-lib';
import { share } from 'rxjs/operators';
import { IUserBalance } from '../src/app/wallet/services/wallet.service';

export const mockDataBalanceTypes = {
  fiat: {
    eur: [
      {id: 0, label: 'AUD'},
      {id: 1, label: 'BIDR'},
      {id: 2, label: 'BKRW'},
      {id: 3, label: 'BTC'},
      {id: 4, label: 'BUSD'},
      {id: 5, label: 'DAI'},
      {id: 6, label: 'XXO'},
    ],
    usd: [
      {id: 0, label: 'AUD'},
      {id: 1, label: 'BIDR'},
      {id: 2, label: 'BKRW'},
      {id: 3, label: 'BTC'},
      {id: 4, label: 'BUSD'},
      {id: 5, label: 'DAI'},
      {id: 6, label: 'XXO'},
    ],
  },
  crosschange_ea: {
    eur: [
      {id: 0, label: 'AUD'},
      {id: 1, label: 'BIDR'},
    ],
    usd: [
      {id: 0, label: 'AUD'},
      {id: 1, label: 'BIDR'},
    ],
  },
  crypto: {
    eur: [
      {id: 3, label: 'BTC'},
      {id: 4, label: 'BUSD'},
      {id: 5, label: 'DAI'},
      {id: 6, label: 'XXO'},
    ],
    usd: [
      {id: 0, label: 'AUD'},
      {id: 1, label: 'BIDR'},
    ],
  },
};
export const walletMock = {
  cryptocurrency: 'btc',
  address: '36KunwNiXhDy6bjJvUqeSMzgCZzfZBksid',
  destination_tag: '',
  id: 0,
  balance: {
    total: 0,
    available: 0,
    in_order: 0,
    btc: 0
  },
};
export const walletsMock = ['ETH', 'XRP', 'BTC', 'LTC', 'BCH', 'DASH', 'USDT', 'USDC', 'XTZ'].map((v, i) => {
  const val = {...walletMock};
  val.cryptocurrency = v.toLowerCase();
  val.address += i + '';
  if (val.cryptocurrency === 'xrp') {
    val.destination_tag = '0x4yiuwyuy4749';
  }
  return val;
});
export const depositsMock: IApiResponse<ITransactionItem> = {
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
export const cryptoList = [
  'mock pair 1',
  'mock pair 2',
  'mock pair 3',
];

export const walletBalanceMock = {
  available_balance: 1,
  total_balance: 1,
  total_balance_eur: 1
};

export const walletListMock = {
  count: 5,
  results: []
};

export interface IDepositHistoryRequest {
  cryptocurrency: string;
  offset?: number;
  limit?: number;
  ordering?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WalletServiceMock {
  private wallets: IWallet[] | null = null;
  private deposits: IApiResponse<ITransactionItem> = {
    count: 0,
    next: '',
    previous: '',
    results: []
  };

  constructor() {
  }

  @Memoized()
  getTradeTypes(balanceType: string, currencyType: string): Observable<TradeType[]> {
    return of(mockDataBalanceTypes[balanceType][currencyType]);
  }

  getCryptoPairs(): Observable<any> {
    return of(cryptoList);
  }

  getWallets(refresh = false): Observable<IWallet[]> {
    if (this.wallets && !refresh) {
      return of(this.wallets);
    }
    // TODO: DELETE WHEN API IS READY
    this.wallets = walletsMock;
    return of(this.wallets).pipe(share());
  }

  getDepositHistory(params: IDepositHistoryRequest): Observable<IApiResponse<ITransactionItem>> {
    if (!params.cryptocurrency || !('offset' in params) || !('limit' in params)) {
      return of(this.deposits);
    }
    depositsMock.results = depositsMock.results.map(v => {
      v.cryptocurrency = params.cryptocurrency;
      v.amount = params.offset;
      return v;
    });
    this.deposits = depositsMock;
    return of(this.deposits);
  }

  getWalletBalance(): Observable<IUserBalance> {
    return of(walletBalanceMock);
  }

  getWalletsList(): Observable<any> {
    return of(walletListMock);
  }
}
