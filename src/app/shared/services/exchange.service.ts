import { Injectable, Injector } from '@angular/core';
import { ApiService } from 'shared-kuailian-lib';
import { ICurrency } from '../interfaces/currency.interface';
import { Observable } from 'rxjs';
import { share, tap } from 'rxjs/operators';
import { IChartData } from '../interfaces/chart-data.interface';
import { HttpParams } from '@angular/common/http';

export enum IChartPeriods {
  DAY = '24h',
  WEEK = '7d',
  MONTH = '4w',
  YEAR = '12m'
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
  paymentMethod: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeService extends ApiService {
  // TODO: IMPLEMENT CACHING
  private currencies: ICurrency[] = [];

  constructor(protected injector: Injector) {
    super(injector);
  }

  getCurrencies(): Observable<ICurrency[]> {
    // TODO: IMPLEMENT CACHING
    /*if (this.currencies.length) {
      return of(this.currencies);
    }*/
    return super.get<ICurrency[]>('exchanges/currencies').pipe(
      tap((v) => this.currencies = v),
      share()
    );
  }

  getChartData(from: string, to: string, period: IChartPeriods, step?: number): Observable<IChartData> {
    const pair = (from + to).toUpperCase();
    const req = {pair, period, step: undefined};

    let params = new HttpParams();

    params = params
      .set('pair', req.pair)
      .set('period', req.period);

    if (step) {
      params = params.set('step', step + '');
    }

    return super.get<IChartData>('exchanges/graph', {params});
  }

  precheck(req: IPreCheckRequest): Observable<IPreCheckResponse> {
    let params = new HttpParams();

    params = params
      .set('amount', req.amount.toString())
      .set('baseCurrency', req.baseCurrency)
      .set('from', req.from)
      .set('to', req.to);

    return super.get<IPreCheckResponse>('exchanges/fee', {params});
  }

  exchange(req: IExchangeRequest): Observable<void> {
    return super.post('quick-trade', req);
  }

}
