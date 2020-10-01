import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'shared-kuailian-lib';
import { ICoin } from '../interfaces/coin.interface';
import { map, share } from 'rxjs/operators';


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
export class CoinsService extends ApiService {
  private readonly coins$: BehaviorSubject<ICoin[]> = new BehaviorSubject<ICoin[]>([]);

  get coinsStream(): Observable<ICoin[]> {
    return this.coins$.asObservable().pipe(share());
  }

  get coinsPopularStream(): Observable<ICoin[]> {
    return this.coins$.asObservable().pipe(
      map((res: ICoin[]) => res.filter(v => v.is_popular)),
      share()
    );
  }

  constructor(protected injector: Injector) {
    super(injector);
  }

  getCoins(): void {
    // TODO: UNCOMMENT WHEN API IS READY
    /*super.get<ICoin[]>('exchanges/coins/').pipe(take(1)).subscribe(v => {
      this.coins$.next(v);
    });*/

    // TODO: DELETE WHEN API IS READY
    this.coins$.next(coinsMock);
  }
}
