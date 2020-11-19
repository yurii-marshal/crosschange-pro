import { Pipe, PipeTransform } from '@angular/core';
import { ICurrency } from 'src/app/shared/interfaces/currency.interface';

@Pipe({
  name: 'currencyType'
})
export class CurrencyTypePipe implements PipeTransform {

  transform(value: ICurrency[], type: string): ICurrency[] {
    // TODO: add to other fiat when fiat is ready
    const ceur: ICurrency[] = [
      {
        key: 'CEUR',
        fields: {
          name: 'Crosschange EUR',
          isFiat: true
        }
      }
    ];

    if (!value || !type) {
      return value || [];
    }

    // TODO: uncomment when fiat is ready
    // return type === 'fiat' ? value.filter(v => v.fields.isFiat) : value.filter(v => !v.fields.isFiat);
    return type === 'fiat' ? ceur : value.filter(v => !v.fields.isFiat);
  }

}
