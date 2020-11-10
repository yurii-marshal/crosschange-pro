import { Pipe, PipeTransform } from '@angular/core';
import { ICurrency } from '../interfaces/currency.interface';
import { ICurrencySelectValue } from '../components/currency-select/ICurrencySelectValue';

@Pipe({
  name: 'currencySelected'
})
export class CurrencySelectedPipe implements PipeTransform {

  transform(value: ICurrency[], selected: ICurrencySelectValue | undefined): ICurrency[] {
    if (!value || !selected || !selected.currency) {
      return value || [];
    }
    return value.filter(v => v.key !== selected.currency.key);
  }

}
