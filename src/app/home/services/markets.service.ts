import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'shared-kuailian-lib';
import { HttpParams } from '@angular/common/http';
import { defaultPagination } from 'src/app/shared/constants/pagination.constant';
import { IExchangeData } from '../../shared/interfaces/exchange-data.interface';
import { SocketService } from '../../shared/services/socket.service';
import { map } from 'rxjs/operators';
import { ICurrency } from 'src/app/shared/interfaces/currency.interface';


@Injectable({
  providedIn: 'root'
})
export class MarketsService extends ApiService {
  private widgets$: BehaviorSubject<IExchangeData[]> = new BehaviorSubject([]);

  constructor(
    protected injector: Injector,
    private socket: SocketService
  ) {
    super(injector);
    this.socket.tradingPairs$
      .pipe(
        map((data) => {
          return this.widgets$.getValue().map((oldItem) => {
            const newItem = data.find((d) => d.exchange_type === oldItem.exchange_type);
            return newItem ? Object.assign({}, oldItem, newItem) : oldItem;
          });
        })
      )
      .subscribe((data) => this.widgets$.next(data));
  }

  loadPairs(query: string, filter: string, params): Observable<{ results: IExchangeData[], count: number }> {
    let parameters = new HttpParams();
    parameters = parameters
      .set('search', query || '')
      .set('currency', filter || '')
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

    return super.delete(url, {body: {exchange_type: pair}});
  }

  loadWidgetsData(): Observable<IExchangeData[]> {
    let params = new HttpParams();
    // FIXME: GET RID OF HARDCODE
    params = params.set('pairs', 'BTCUSDT,ETHUSDT,LTCUSDT,DASHUSDT').set('provider', 'kraken').set('step', '30');

    super.get('exchanges/rates', {params}).subscribe((v: IExchangeData[]) => {
      this.widgets$.next(v);
    });
    return this.widgets$.asObservable();
  }

  loadDropdownData(): Observable<ICurrency[]> {

    return super.get('exchanges/currencies');
  }
}
