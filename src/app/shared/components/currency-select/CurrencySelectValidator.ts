import { FormControl } from '@angular/forms';
import { CurrencySelectValidationErrors } from './CurrencySelectValidationErrors';

function isFloat(num: string): boolean {
  return !isNaN(+num) && !isNaN(parseFloat(num));
}

export function validate({ value }: FormControl): { [key: string]: boolean } | null {
  const currency = value && value.currency;
  const amount = value && value.amount;
  if (!currency) {
    return { [CurrencySelectValidationErrors.CRYPTO_REQUIRED]: true };
  }
  if (!isFloat(amount)) {
    return {[CurrencySelectValidationErrors.AMOUNT_NOT_NUMBER]: true };
  }
  return null;
}

export class CurrencySelectValidators {

  public static amountNotNumber({ value }: FormControl): { [key: string]: boolean } | null {
    const amount = value && value.amount;
    if (!isFloat(amount)) {
      return {[CurrencySelectValidationErrors.AMOUNT_NOT_NUMBER]: true };
    }
    return null;
  }

  public static cryptoRequired({ value }: FormControl): { [key: string]: boolean } | null {
    return value && value.currency && value.currency.key ? null : {
      [CurrencySelectValidationErrors.CRYPTO_REQUIRED]: true
    };
  }

  public static amountRequired({ value }: FormControl): { [key: string]: boolean } | null {
    return value && !!+value.amount ? null : {
      [CurrencySelectValidationErrors.AMOUNT_REQUIRED]: true
    };
  }

}
