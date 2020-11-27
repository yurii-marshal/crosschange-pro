import { Injectable, Injector } from '@angular/core';
import { ApiService, IApiResponse } from 'shared-kuailian-lib';
import { Observable, of } from 'rxjs';
import { ITradeCoinType, ITradePair } from '../../core/interfaces/trade-pair.interface';
import { map, share } from 'rxjs/operators';
import { Cacheable } from 'ngx-cacheable';
import { HttpClient } from '@angular/common/http';
import { IOrderHistoryData } from '../../core/interfaces/order-history.interface';

const pairsDataSourceMock = {
  next: '',
  previous: '',
  results: [
    {
      pair: 'ETH/AUD',
      lastPrice: {
        price: 0.003610,
        exchanged: 56.06
      },
      change: -1.5
    },
    {
      pair: 'ETH/BIDR',
      lastPrice: {
        price: 0.003610,
        exchanged: 56.06
      },
      change: 3.00
    },
    {
      pair: 'ETH/BKRW',
      lastPrice: {
        price: 0.003610,
        exchanged: 56.06
      },
      change: -1.5
    },
    {
      pair: 'ETH/BTC',
      lastPrice: {
        price: 0.003610,
        exchanged: 56.06
      },
      change: -1.5
    },
    {
      pair: 'ETH/BUSD',
      lastPrice: {
        price: 0.003610,
        exchanged: 56.06
      },
      change: -1.5
    },
    {
      pair: 'ETH/BIDR',
      lastPrice: {
        price: 0.003610,
        exchanged: 56.06
      },
      change: 3.00
    },
    {
      pair: 'ETH/BKRW',
      lastPrice: {
        price: 0.003610,
        exchanged: 56.06
      },
      change: -1.5
    }
  ],
  count: 7,
};

const orderHistoryDataSourceMock = {
  next: '',
  previous: '',
  results: [
    {
      date: '2011-08-12T20:17:46.384Z',
      pair: 'XRP / ETH',
      type: 'Stop Loss Limit',
      side: 'Sell',
      average: 0.0003591,
      executed: 30,
      amount: 0,
      total: 0.0003591,
      trigger_condition: 0.0003591
    },
    {
      date: '2011-08-14T20:17:46.384Z',
      pair: 'XRP / ETH',
      type: 'Stop Loss Limit',
      side: 'Buy',
      average: 0.0003591,
      executed: 30,
      amount: 0,
      total: 0.0003591,
      trigger_condition: 0.0003591
    }
  ],
  count: 2,
};

@Injectable({
  providedIn: 'root'
})
export class TradeService extends ApiService {

  constructor(
    protected injector: Injector,
    private http: HttpClient,
  ) {
    super(injector);
  }

  @Cacheable({
    maxAge: 5 * 60 * 1000, // 5min
  })
  getTradePairs(query: string, type: ITradeCoinType): Observable<IApiResponse<ITradePair>> {

    // TODO: uncomment when endpoint is ready
    // let parameters = new HttpParams();
    // parameters = parameters
    //   .set('search', query || '')
    //   .set('type', params.tab || 'all');
    //
    // return super.get('trade/pairs', {params: parameters});

    // TODO: remove when endpoint is ready
    // return this.http.get('./assets/json/pairsDataSourceMock.json')
    return of(pairsDataSourceMock)
      .pipe(
        map((res: IApiResponse<ITradePair>) => {
          if (query) {
            res.results.filter(v => v.pair.toLowerCase().includes(query.toLowerCase()));
          }

          if (type !== 'all') {
            res.results = [];
          }

          return res;
        }),
        share(),
      );
  }

  getOrderHistory(): Observable<IApiResponse<IOrderHistoryData>> {
    // return this.http.get('./assets/json/orderHistoryDataSourceMock.json')
    return of(orderHistoryDataSourceMock)
      .pipe(share()) as Observable<IApiResponse<IOrderHistoryData>>;
  }

  placeOrder(body): Observable<any> {
    return of(true);
  }

}
