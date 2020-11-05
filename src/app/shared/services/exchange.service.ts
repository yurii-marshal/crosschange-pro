import { Injectable, Injector } from '@angular/core';
import { ApiService } from 'shared-kuailian-lib';
import { ICurrency } from '../interfaces/currency.interface';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, share, tap } from 'rxjs/operators';
import { IChartData } from '../interfaces/chart-data.interface';
import { HttpParams } from '@angular/common/http';
import { defaultPagination } from '../constants/pagination.constant';


export enum IChartPeriods {
  DAY = '24h',
  WEEK = '1w',
  MONTH = '1m',
  YEAR = '1y'
}

export interface IPreCheckResponse {
  amount: number;
  valid: boolean;
  rate: number;
  fee?: number;
}

export interface IPreCheckRequest {
  from: string;
  to: string;
  amount: number;
  baseCurrency: string;
}

export interface IExchangeRequest {
  from: string;
  to: string;
  amount: number;
  rate: number;
  fee: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeService extends ApiService {
  private currencies: ICurrency[] = [];

  constructor(protected injector: Injector) {
    super(injector);
  }

  getCurrencies(): Observable<ICurrency[]> {
    if (this.currencies.length) {
      return of(this.currencies);
    }
    return super.get<ICurrency[]>('exchanges/currencies').pipe(
      tap((v) => this.currencies = v),
      share()
    );
  }

  getChartData(from: string, to: string, period: IChartPeriods, step?: number): Observable<IChartData> {
    const pair = (from + to).toUpperCase();
    const req = { pair, period, step: undefined };
    if (step) {
      req.step = step;
    }

    let params = new HttpParams();

    params = params
      .set('pair', req.pair)
      .set('period', req.period)
      .set('step', req.step);

    return super.get<IChartData>('exchanges/graph', {params});
  }

  precheck(req: IPreCheckRequest): Observable<IPreCheckResponse> {
    // TODO: DELETE
    const res = {
      amount:  Math.random() * (100 - 1) + 1,
      valid: true,
      rate: Math.random() * (100 - 1) + 1,
      fee: Math.random() * (100 - 1) + 1
    };
    return of(res).pipe(delay(2000));
    // let params = new HttpParams();
    //
    // params = params
    //   .set('amount', req.amount.toString())
    //   .set('baseCurrency', req.baseCurrency)
    //   .set('from', req.from)
    //   .set('to', req.to);
    //
    // return super.get<IPreCheckResponse>('exchanges/fee', {params});
  }

  exchange(request: IExchangeRequest): Observable<void> {
    // TODO: UNCOMMENT
    // return super.post('/quick-trade', request);
    // TODO: DELETE
    return of(undefined).pipe(delay(2000));
  }

}
