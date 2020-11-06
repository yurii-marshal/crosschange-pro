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

  bothCurrenciesEqual([from, to]): boolean {
    if (!from.currency || !to.currency) {
      return true;
    }
    return from.currency && from.currency.key &&  to.currency && to.currency.key && from.currency.key !== to.currency.key;
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

  distinctControlsData([fOld, tOld], [fNew, tNew]): boolean {
    return (fOld && fOld.currency && fOld.currency.key) === (fNew && fNew.currency && fNew.currency.key)
      && (tOld && tOld.currency && tOld.currency.key) === (tNew && tNew.currency && tNew.currency.key)
      && (fOld && fOld.amount) === (fNew && fNew.amount) && (tOld && tOld.amount) === (tNew && tNew.amount);
  }

  bothCurrenciesSet([fromCurrency, toCurrency]): boolean {
    return fromCurrency
      && fromCurrency.currency
      && toCurrency
      && toCurrency.currency;
  }

  setConvertDirection([oldFrom, oldTo], [fromCurrency, toCurrency]): { target: string, update: string } {
    if (!fromCurrency.currency && !toCurrency.currency) {
      return { target: '', update: '' };
    }
    const updateFrom = { target: 'fromCurrency', update: 'toCurrency'};
    const updateTo = {target: 'toCurrency', update: 'fromCurrency' };
    const amountCleared = [
      oldFrom.currency,
      oldTo.currency,
      fromCurrency.currency,
      toCurrency.currency,
      oldTo.amount,
      fromCurrency.amount
    ];
    // if amount cleared by user - stop updating.
    if (amountCleared.every(Boolean) && (!fromCurrency.amount || !toCurrency.amount)) {
      return { target: '', update: '' };
    }

    const fromAllSet = fromCurrency.currency && fromCurrency.currency.key && fromCurrency.amount;
    const toAllSet = toCurrency.currency && toCurrency.currency.key && toCurrency.amount;

    // if something is not set - update based on the field where everything is set
    if (!fromAllSet || !toAllSet) {
      return !toAllSet ?  updateFrom : updateTo;
    }

    const allSet = [ fromCurrency.currency, toCurrency.currency, fromCurrency.amount, toCurrency.amount ];

    // if all set - update based on the last field changed.
    if (allSet.every(Boolean)) {
      const toChanged = [
        (oldTo.currency && oldTo.currency.key) !== toCurrency.currency.key,
        oldTo.amount !== toCurrency.amount
      ].some(Boolean);

      return toChanged ? updateTo : updateFrom;
    }

    return {target: '', update: ''};
  }
}

