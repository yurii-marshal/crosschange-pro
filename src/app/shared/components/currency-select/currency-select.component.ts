import {
  ChangeDetectionStrategy,
  Component,
  forwardRef, OnDestroy,
  OnInit
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ICurrency } from '../../interfaces/currency.interface';
import { ExchangeService } from '../../services/exchange.service';

@Component({
  selector: 'app-currency-select',
  templateUrl: './currency-select.component.html',
  styleUrls: ['./currency-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencySelectComponent),
      multi: true
    }
  ]
})
export class CurrencySelectComponent implements OnInit, OnDestroy, ControlValueAccessor {
  opened = false;
  currencies: ICurrency[];
  currenciesFiltered$: BehaviorSubject<ICurrency[]> = new BehaviorSubject<ICurrency[]>([]);
  selected: ICurrency;
  amount: FormControl = new FormControl();
  onDestroy$: Subject<void> = new Subject();
  value: {
    currency: ICurrency,
    amount: number
  };
  searchValue = '';
  onChange = (value: { currency: ICurrency, amount: number }) => {};
  onTouched = () => {};
  constructor(
    private exchange: ExchangeService
  ) { }

  ngOnInit(): void {
    this.exchange.getCurrencies()
      .pipe(
        take(1),
      ).subscribe(v => {
      this.currenciesFiltered$.next(v);
      this.currencies = v;
    });

    this.amount.valueChanges.pipe(
      takeUntil(this.onDestroy$),
      debounceTime(300)
    ).subscribe(v => {
      this.writeValue({
        currency: this.selected,
        amount: parseInt(v, 10)
      });
    });
  }

  registerOnChange(fn: (value: { currency: ICurrency, amount: number }) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setCurrency(currency: ICurrency): void {
    this.selected = currency;
    this.writeValue({currency: this.selected, amount: parseInt(this.amount.value, 10) });
  }

  writeValue(value: { currency: ICurrency, amount: number }): void {
    if (!value) {
      return;
    }
    this.selected = value.currency;
    this.onChange({
      currency: this.selected,
      amount: parseInt(this.amount.value, 10)
    });
  }

  onCloseDropdown(): void {
    if (this.opened) {
      return;
    }
    this.currenciesFiltered$.next(this.currencies);
    this.searchValue = '';
  }

  search(input: string): void {
    input = input || '';
    if (!input) {
      this.currenciesFiltered$.next(this.currencies);
      return;
    }
    const res = this.currencies.filter((currency) => {
      return currency.key.toLowerCase().indexOf(input.toLowerCase()) > -1
        || currency.fields.name.toLowerCase().indexOf(input.toLowerCase()) > -1;
    });
    this.currenciesFiltered$.next(res);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
