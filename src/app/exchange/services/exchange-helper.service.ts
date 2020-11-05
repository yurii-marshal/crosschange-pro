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
  ) {
  }

  convertFilter(form: FormGroup, target: string, toUpdate: string): boolean {
    return form.get(target).value
      && form.get(toUpdate).value
      && (form.get(toUpdate).value && form.get(target).value.currency) && form.get(toUpdate).value.currency
      && !!((form.get(target).value.currency && +form.get(target).value.amount)
        || (form.get(toUpdate).value && +form.get(toUpdate).value.amount));
  }

  preCheckRequest(form: FormGroup, target: string, toUpdate: string): Observable<IPreCheckResponse> {
    const req = {
      from: form.get(target).value.currency.key,
      to: form.get(toUpdate).value.currency.key,
      amount: form.get(target).value.amount,
      baseCurrency: form.get('fromCurrency').value.currency.key
    };
    return this.exchange.precheck(req);
  }

  distinctCurrency([fOld, tOld], [fNew, tNew]): boolean {
    return (fOld && fOld.currency && fOld.currency.key) === (fNew && fNew.currency && fNew.currency.key)
      && (tOld && tOld.currency && tOld.currency.key) === (tNew && tNew.currency && tNew.currency.key);
  }

  distinctControlsData([fOld, tOld], [fNew, tNew]): boolean {
    return (fOld && fOld.currency && fOld.currency.key) === (fNew && fNew.currency && fNew.currency.key)
      && (tOld && tOld.currency && tOld.currency.key) === (tNew && tNew.currency && tNew.currency.key)
      && (fOld && fOld.amount) === (fNew && fNew.amount) && (tOld && tOld.amount) === (tNew && tNew.amount);
  }

  bothCurrenciesSet([fromCurrency, toCurrency]): boolean {
    return !!(fromCurrency
      && fromCurrency.currency
      && toCurrency
      && toCurrency.currency);
  }

  setConvertDirection([oldFrom, oldTo], [fromCurrency, toCurrency]): { target: string, update: string } {
    if (!oldTo.amount && toCurrency.amount === '') {
      return {target: 'fromCurrency', update: 'toCurrency'};
    } else if (!oldFrom.amount && fromCurrency.amount === '') {
      return {target: 'toCurrency', update: 'fromCurrency'};
    }
    if (oldTo.amount === '' && toCurrency.amount) {
      return {target: 'toCurrency', update: 'fromCurrency'};
    } else if (oldFrom.amount === '' && fromCurrency.amount) {
      return {target: 'fromCurrency', update: 'toCurrency'};
    }
    if (oldFrom.amount && oldTo.amount && fromCurrency.amount && toCurrency.amount) {
      if (oldFrom.amount !== fromCurrency.amount) {
        return {target: 'fromCurrency', update: 'toCurrency'};
      } else if (oldTo.amount !== toCurrency.amount) {
        return {target: 'toCurrency', update: 'fromCurrency'};
      } else {
        if (!oldFrom.currency && fromCurrency.currency) {
          return {target: 'fromCurrency', update: 'toCurrency'};
        } else if (!oldTo.currency && toCurrency.currency) {
          return {target: 'toCurrency', update: 'fromCurrency'};
        } else if (oldFrom.currency.key === fromCurrency.currency.key) {
          return {target: 'toCurrency', update: 'fromCurrency'};
        } else if (oldTo.currency.key === toCurrency.currency.key) {
          return {target: 'fromCurrency', update: 'toCurrency'};
        }
      }
    }

    return {target: '', update: ''};
  }
}

