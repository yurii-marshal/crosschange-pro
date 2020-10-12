import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'shared-kuailian-lib';
import { HttpParams } from '@angular/common/http';
import { defaultPagination } from 'src/app/shared/constants/pagination.constant';
import { IExchangeData } from '../../shared/interfaces/exchange-data.interface';


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
      .set('type', params.tab || 'favorite')
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

  loadWidgetsData(): Observable<IExchangeData[]> {
    let params = new HttpParams();
    params = params.set('pairs', 'BTCUSD,ETHUSD,LTCUSD,DASHUSD').set('provider', 'kraken').set('step', '30');

    return super.get('exchanges/rates', {params});
  }
}
