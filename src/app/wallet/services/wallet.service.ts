import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TradeType } from '../../core/interfaces/trade-type.interface';
import { Memoized } from '../../core/decorators/memoized.decorator';
import { ApiService } from 'shared-kuailian-lib';
import { IWallet } from '../../shared/interfaces/wallet.interface';
import {
  ITransactionItem,
  TransactionStatus,
  TransactionType
} from '../../shared/interfaces/transaction-item.interface';
import { IApiResponse } from 'shared-kuailian-lib';
import { share, tap } from 'rxjs/operators';
import { ICoin } from '../../shared/interfaces/coin.interface';
import { HttpParams } from '@angular/common/http';

const mockDataBalanceTypes = [
  {id: 0, label: 'AUD'},
  {id: 1, label: 'BIDR'},
  {id: 2, label: 'BKRW'},
  {id: 3, label: 'BTC'},
  {id: 4, label: 'BUSD'},
  {id: 5, label: 'DAI'},
  {id: 6, label: 'XXO'},
];

const mockDataTable = [
  {
    coin: 'eur',
    total: '0',
    available: '0',
    inOrder: '0',
    btcValue: '0',
  },
  {
    coin: 'usd',
    total: '0',
    available: '0',
    inOrder: '0',
    btcValue: '0',
  },
];

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

export interface ISerializedCoins {
  balanceType: ICoin[];
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
  serializedCoins: ISerializedCoins;
  serializedCoinsMockData = mockDataBalanceTypes;

  private wallets: IWallet[] | null = null;

  private deposits: IApiResponse<ITransactionItem> = {
    count: 0,
    next: '',
    previous: '',
    results: []
  };

  constructor(protected injector: Injector) {
    super(injector);
  }

  @Memoized()
  getTradeTypes(balanceType: string, currencyType: string): Observable<TradeType[]> {
    return of(mockDataBalanceTypes);
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
    return super.get<IApiResponse<ITransactionItem>>(`transactions`, req).pipe(share())*/

    // TODO: DELETE WHEN API IS READY
    depositsMock.results = depositsMock.results.map(v => {
      v.cryptocurrency = params.cryptocurrency;
      v.amount = params.offset;
      return v;
    });
    this.deposits = depositsMock;
    return of(this.deposits);
  }

  @Memoized()
  getCoinTypes(params?): Observable<ICoin[]> {
    return super.get('exchanges/rates', params) // ?pairs=USD
      .pipe(tap((coinTypes: ICoin[]) => this.serializedCoins = serializeCoins(coinTypes)));
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

function serializeCoins(coinTypes: ICoin[]): ISerializedCoins {
  let serializedCoins = {} as ISerializedCoins;

  coinTypes
    .map((coin: ICoin) => coin.balance_type)
    .forEach((balanceType: string) => {
      serializedCoins = {
        ...serializedCoins,
        ...{[balanceType]: coinTypes.filter((item: ICoin) => item.balance_type === balanceType)},
      };
    });

  return serializedCoins;
}
