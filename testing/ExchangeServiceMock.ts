import { BehaviorSubject, Observable, of } from 'rxjs';
import { ICurrency } from '../src/app/shared/interfaces/currency.interface';
import { delay } from 'rxjs/operators';
import { IChartData } from '../src/app/shared/interfaces/chart-data.interface';
import { IChartPeriods, IExchangeRequest, IPreCheckResponse, IPreCheckRequest } from '../src/app/shared/services/exchange.service';


export const currenciesMock: ICurrency[] = [
  {
    key: 'btc',
    fields: {
      name: 'Bitcoin',
      isFiat: false
    },
  },
  {
    key: 'eur',
    fields: {
      name: 'Euro',
      isFiat: true
    }
  },
  {
    key: 'dash',
    fields: {
      name: 'Dash',
      isFiat: true
    }
  },
];

export class ExchangeServiceMock {
  private currencies: ICurrency[] = [];
  constructor() {}

  getCurrencies(): Observable<ICurrency[]> {
    if (this.currencies.length) {
      return of(this.currencies);
    }
    this.currencies = currenciesMock;
    return of(this.currencies);
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
  private generatePreCheck(): IPreCheckResponse {
    return {
      amount:  Math.random() * (100 - 1) + 1,
      valid: true,
      rate: Math.random() * (100 - 1) + 1,
      fee: Math.random() * (100 - 1) + 1
    };
  }

  precheck(req: IPreCheckRequest): Observable<IPreCheckResponse> {
    return of(this.generatePreCheck());
  }

  exchange(request: IExchangeRequest): Observable<void> {
    return of(undefined);
  }
}
