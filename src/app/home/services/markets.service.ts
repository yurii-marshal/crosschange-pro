import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IWidget } from 'src/app/shared/interfaces/widget.interface';
import { ApiService } from 'shared-kuailian-lib';
import { HttpParams } from '@angular/common/http';
import { defaultPagination } from 'src/app/shared/constants/pagination.constant';
import { IExchangeData } from '../../shared/interfaces/exchange-data.interface';

const mockData: IWidget[] = [
  {
    icon: 'icon_bitcoin_widget',
    currencyType: 'BND / USD',
    amount: '14.4062',
    change: '-0.41%',
    volume: '70,219,049.03 USDT',
    color: 'linear-gradient(109.38deg, #FFA749 0%, #FF8300 100%), #1B202D'
  },
  {
    icon: 'icon_eth_widget',
    currencyType: 'BND / USD',
    amount: '14.4062',
    change: '-0.41%',
    volume: '70,219,049.03 USDT',
    color: 'linear-gradient(109.38deg, #418FFC 0%, #2264C0 100%), linear-gradient(0deg, #1B202D, #1B202D), linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%), #FFFFFF'
  },
  {
    icon: 'icon_ark_widget',
    currencyType: 'BND / USD',
    amount: '14.4062',
    change: '-0.41%',
    volume: '70,219,049.03 USDT',
    color: 'linear-gradient(109.38deg, #F75555 0%, #CB3636 100%), linear-gradient(109.38deg, #3C87C7 0%, #1562A1 100%), #1B202D'
  },
  {
    icon: 'icon_bitcoin_cash_widget',
    currencyType: 'BND / USD',
    amount: '14.4062',
    change: '-0.41%',
    volume: '70,219,049.03 USDT',
    color: 'linear-gradient(109.38deg, #5DBD61 0%, #38993C 100%), #1B202D'
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

  getWidgetsData(): Observable<any> {
    return of(mockData);
  }
}
