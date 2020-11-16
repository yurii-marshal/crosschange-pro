import { Injectable, Injector } from '@angular/core';
import { ApiService } from 'shared-kuailian-lib';
import { Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { defaultPagination } from '../../shared/constants/pagination.constant';

export interface ITradePairsData {
  pair: string;
  lastPrice: {
    price: number;
    exchanged: number;
  };
  change: number;
}

const pairsDataSourceMock = [
  {
    pair: 'ETH/AUD',
    lastPrice: {
      price: 0.003610,
      exchanged: 56.06,
    },
    change: -1.5,
  },
  {
    pair: 'ETH/BIDR',
    lastPrice: {
      price: 0.003610,
      exchanged: 56.06,
    },
    change: 3.00,
  },
  {
    pair: 'ETH/BKRW',
    lastPrice: {
      price: 0.003610,
      exchanged: 56.06,
    },
    change: -1.5,
  },
  {
    pair: 'ETH/BTC',
    lastPrice: {
      price: 0.003610,
      exchanged: 56.06,
    },
    change: -1.5,
  },
  {
    pair: 'ETH/BUSD',
    lastPrice: {
      price: 0.003610,
      exchanged: 56.06,
    },
    change: -1.5,
  },
  {
    pair: 'ETH/BIDR',
    lastPrice: {
      price: 0.003610,
      exchanged: 56.06,
    },
    change: 3.00,
  },
  {
    pair: 'ETH/BKRW',
    lastPrice: {
      price: 0.003610,
      exchanged: 56.06,
    },
    change: -1.5,
  },
];

@Injectable({
  providedIn: 'root'
})
export class TradeService extends ApiService {

  constructor(protected injector: Injector) {
    super(injector);
  }

  getTradePairs(query: string, params): Observable<{ results: ITradePairsData[], count: number }> {
    // TODO: uncomment when endpoint is ready
    // let parameters = new HttpParams();
    // parameters = parameters
    //   .set('search', query || '')
    //   .set('type', params.tab || 'all')
    //   .set('orderby', params.orderby || 'last')
    //   .set('offset', params.offset || defaultPagination.offset)
    //   .set('limit', params.limit || defaultPagination.limit);
    //
    // return super.get('trade/pairs', {params: parameters});

    // TODO: remove when endpoint is ready
    return of({
      results: query ? pairsDataSourceMock.filter(v => v.pair.toLowerCase().includes(query.toLowerCase())) : pairsDataSourceMock,
      count: pairsDataSourceMock.length,
    });
  }

}
