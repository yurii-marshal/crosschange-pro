import { ICurrency } from '../../interfaces/currency.interface';

export interface ICurrencySelectValue {
  currency: ICurrency;
  amount: number | string;
  lastChange: number;
}
