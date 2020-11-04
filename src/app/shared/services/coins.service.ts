import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'shared-kuailian-lib';
import { ICoin } from '../interfaces/coin.interface';
import { IExchangeData } from '../interfaces/exchange-data.interface';
import { HttpParams } from '@angular/common/http';
import { map, share, tap } from 'rxjs/operators';


// TODO: DELETE WHEN API IS READY
const coinsMock: ICoin[] = [
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
    is_popular: true
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
    is_popular: true
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
export class CoinsService extends ApiService {
  private coins: ICoin[] = [];

  constructor(protected injector: Injector) {
    super(injector);
  }

  getCoins(): Observable<ICoin[]> {
    if (this.coins.length) {
      return of(this.coins);
    }
    this.coins = coinsMock;
    return of(coinsMock).pipe(share());

    // return super.get<ICoin[]>('exchanges/coins').pipe(
    //   tap((v) => this.coins = v),
    //   share()
    // );
  }

  getPopular(): Observable<ICoin[]> {
    return this.getCoins().pipe(
      map((res: ICoin[]) => res.filter(v => v.is_popular))
    );
  }

  getRate(fromCoin: string, toCoin: string, step?: number): Observable<IExchangeData> {
    let params = new HttpParams();
    fromCoin = fromCoin.toUpperCase();
    toCoin = toCoin.toUpperCase();
    params = params.set('pairs', fromCoin + toCoin);
    if (step) {
      params = params.set('step', step + '');
    }

    return super.get('exchanges/rates', {params}).pipe(map((data: IExchangeData[]) => data.shift()) );
  }
}
