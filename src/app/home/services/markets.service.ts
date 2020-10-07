import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IWidget } from 'src/app/shared/interfaces/widget.interface';
import { ApiService } from 'shared-kuailian-lib';
import { HttpParams } from '@angular/common/http';
import { defaultPagination } from 'src/app/shared/constants/pagination.constant';
import { IExchangeData } from '../../shared/interfaces/exchange-data.interface';

const mockData: IWidget[] = [
  {
    icon: 'icon_btc',
    currencyType: 'BND / USD',
    amount: '14.4062',
    change: '-4.02%',
    volume: '70,219,049.03 USDT',
  },
  {
    icon: 'icon_eth',
    currencyType: 'ETH / USD',
    amount: '14.4062',
    change: '+12.02%',
    volume: '70,219,049.03 USDT'
  },
  {
    icon: 'icon_ark',
    currencyType: 'ARK / USD',
    amount: '14.4062',
    change: '-0.41%',
    volume: '70,219,049.03 USDT',
  },
  {
    icon: 'icon_bch',
    currencyType: 'BCH / USD',
    amount: '14.4062',
    change: '-5.09%',
    volume: '70,219,049.03 USDT',
  }
];

@Injectable({
  providedIn: 'root'
})
export class MarketsService extends ApiService {

  constructor(protected injector: Injector) {
    super(injector);
  }

  loadPairs(query: string, params): Observable<{ results: IExchangeData[], count: number }> {
    let parameters = new HttpParams();
    parameters = parameters
      .set('search', query || '')
      .set('type', params.tab)
      .set('orderby', params.orderby || 'last')
      .set('offset', params.offset || defaultPagination.offset)
      .set('limit', params.limit || defaultPagination.limit);

    return super.get('exchanges/markets', {params: parameters});
  }

  addToFavorite(pair: string): Observable<any> {
    const url = 'exchanges/rates/favorites';

    return super.post(url, {exchange_type: pair});
  }

  deleteFromFavourite(pair: string): Observable<any> {
    const url = 'exchanges/rates/favorites';

    return super.delete(url, { body : { exchange_type: pair } });
  }

  loadWidgetsData(): Observable<any> {
    let params = new HttpParams();
    params = params.set('pairs', 'BTCUSD,ETHUSD,LTCUSD,DASHUSD').set('provider', 'kraken');

    return super.get('exchanges/rates', {params});
  }

  getWidgetsData(): Observable<any> {
    return of(mockData);
  }
}
