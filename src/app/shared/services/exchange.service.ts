import { Injectable, Injector } from '@angular/core';
import { ApiService } from 'shared-kuailian-lib';
import { ICurrency } from '../interfaces/currency.interface';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, share, tap } from 'rxjs/operators';
import { IChartData } from '../interfaces/chart-data.interface';


export enum IChartPeriods {
  DAY = '24h',
  WEEK = '1w',
  MONTH = '1m',
  YEAR = '1y'
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

  getChartData(from: string, to: string, period: IChartPeriods, step?: number): Observable<IChartData[]> {
    // TODO: UNCOMMENT
    /*const pair = (from + to).toUpperCase();
    const req = { pair, period, step: undefined };
    if (step) {
      req.step = step;
    }
    return super.get('/exchanges/graph');*/
    // TODO: DELETE WHEN API IS READY
    const mock = new Array(70).fill(1).map((v, i) => {
      const name = i % 10 === 0 ? i : '';
      return { name, value: Math.random() * (4000 - 3000) + 3000};
    });
    const subj = new BehaviorSubject(mock as IChartData[]);
    return subj.asObservable().pipe(delay(200));
  }
}
