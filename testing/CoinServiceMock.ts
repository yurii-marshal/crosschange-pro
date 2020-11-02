import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ICoin } from '../src/app/shared/interfaces/coin.interface';
import { IExchangeData } from '../src/app/shared/interfaces/exchange-data.interface';

export const coinsMock: ICoin[] = [
  {
    key: 'btc',
    name: 'Bitcoin',
    is_popular: true
  },
  {
    name: 'Bitcoin Cash',
    key: 'bch',
    is_popular: true
  },
  {
    name: 'Dash',
    key: 'dash',
    is_popular: false
  },
  {
    name: 'Basic Attention',
    key: 'eth',
    is_popular: true
  },
  {
    key: 'ltc',
    name: 'Litecoin',
    is_popular: true
  },
  {
    key: 'xrp',
    name: 'Ripple',
    is_popular: false
  },
  {
    key: 'usdt',
    name: 'Tether',
    is_popular: false
  },
  {
    key: 'usdc',
    name: 'USD Coin',
    is_popular: false
  },
  {
    key: 'xtz',
    name: 'Tezos',
    is_popular: false
  }
];


@Injectable({
  providedIn: 'root'
})
export class CoinServiceMock {
  constructor() {
  }

  getCoins(): Observable<ICoin[]> {
    return of(coinsMock);
  }

  getPopular(): Observable<ICoin[]> {
    return of(coinsMock.filter(v => v.is_popular));
  }

  getRate(fromCoin: string, toCoin: string, step?: number): Observable<IExchangeData> {
    return of({
      is_favorite: false,
      exchange_type: '1',
      last: '1',
      exchange_rate: '1',
      change_percent_24: '1',
      high_24: '1',
      low_24: '1',
      market_cap: '1',
      vol_24: '1',
      pair: '1',
      cng: '1',
      high: '1',
      low: '1',
      vol: '1',
      mktCap: '1',
      prices: [],
    });
  }
}
