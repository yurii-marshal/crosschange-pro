import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Memoized } from '../../core/decorators/memoized.decorator';
import { ApiService } from 'shared-kuailian-lib';
import { tap } from 'rxjs/operators';

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
  }
];

const mockDataBalanceTypes = {
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

export interface Wallet {
  cryptocurrency: string; // 'btc', 'eth' etc.
  address: string; // wallet address
  tag: string; // used for e.g. in Ripple.
  id: number;
  balance: {
    total: number;
    available: number;
    in_order: number;
    btc: number; // value in btc
  };
}

export interface Coin {
  key: string;
  name: string;
  balance_type: string;
  is_popular: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService extends ApiService {

  serializedCoins = {};

  constructor(protected injector: Injector) {
    super(injector);
  }

  @Memoized()
  getCoinTypes(): Observable<Coin[]> {
    return super.get('exchanges/coins')
      .pipe(tap((coinTypes: Coin[]) => this.serializedCoins = serializeCoins(coinTypes)));
  }

  getWalletsList(params: any): Observable<any> {
    return super.get('spot-wallets');
  }

  getTotalBalance(): Observable<any> {
    return of({totalBalanceCC: 10.564544, totalBalanceUSD: 344444.55});
  }
}

function serializeCoins(coinTypes: Coin[]): object {
  let serializedCoins = {};

  coinTypes
    .map((coin: Coin) => coin.balance_type)
    .forEach((balanceType: string) => {
      serializedCoins = {
        ...serializedCoins,
        ...{[balanceType]: coinTypes.filter((item: Coin) => item.balance_type === balanceType)},
      };
    });

  return serializedCoins;
}
