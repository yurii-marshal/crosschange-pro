import { Injectable } from '@angular/core';
import { ExchangeService, IPreCheckResponse } from '../../shared/services/exchange.service';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ExchangeHelperService {

  constructor(
    private exchange: ExchangeService
  ) { }

  convertFilter(form: FormGroup, target: string, toUpdate: string): boolean {
    return form.get(target).value
      && form.get(toUpdate).value
      && (form.get(toUpdate).value && form.get(target).value.currency)
      && !!((form.get(target).value.currency && +form.get(target).value.amount)
        || (form.get(toUpdate).value && +form.get(toUpdate).value.amount));
  }

  preCheckRequest(form: FormGroup, target: string, toUpdate: string): Observable<IPreCheckResponse> {
    const req = {
      from: form.get(target).value.currency,
      to: form.get(toUpdate).value.currency,
      amount: form.get(target).value.amount,
      baseCurrency: form.get('fromCurrency').value.currency
    };
    return this.exchange.precheck(req);
  }

  distinctCurrency([fOld, tOld], [fNew, tNew]): boolean {
    return (fOld && fOld.currency && fOld.currency.key) === (fNew && fNew.currency && fNew.currency.key)
    && (tOld && tOld.currency && tOld.currency.key) === (tNew && tNew.currency && tNew.currency.key);
  }

  bothCurrenciesSet([fromCurrency, toCurrency]): boolean {
    return fromCurrency
      && fromCurrency.currency
      && toCurrency
      && toCurrency.currency;
  }
}
