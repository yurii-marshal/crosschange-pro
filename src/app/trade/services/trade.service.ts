import { Injectable, Injector } from '@angular/core';
import { ApiService, IApiResponse } from 'shared-kuailian-lib';
import { Observable } from 'rxjs';
import { ITradeCoinType, ITradePair } from '../../core/interfaces/trade-pair.interface';
import { map, share } from 'rxjs/operators';
import { Cacheable } from 'ngx-cacheable';
import { HttpClient } from '@angular/common/http';

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
    return this.http.get('./assets/json/pairsDataSourceMock.json')
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

}