import {
  ChangeDetectionStrategy,
  Component,
  forwardRef, Input, OnChanges, OnDestroy,
  OnInit, SimpleChanges, ViewChild
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, map, take } from 'rxjs/operators';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ICurrency } from '../../interfaces/currency.interface';
import { ExchangeService } from '../../services/exchange.service';
import { validate } from './CurrencySelectValidator';
import { ICurrencySelectValue } from './ICurrencySelectValue';

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
    },
    { provide: NG_VALIDATORS, useValue: validate, multi: true }
  ]
})
export class CurrencySelectComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  @ViewChild('input') input;
  @ViewChild('mobileInput') mobileInput;
  @Input() disabled;
  public keyUp = new Subject<KeyboardEvent>();
  opened = false;
  currencies: ICurrency[];
  currenciesFiltered$: BehaviorSubject<ICurrency[]> = new BehaviorSubject<ICurrency[]>([]);
  selected$: BehaviorSubject<ICurrency> = new BehaviorSubject<ICurrency>(null);
  amount: FormControl = new FormControl();
  onDestroy$: Subject<void> = new Subject();
  value: {
    currency: ICurrency,
    amount: number | string;
    lastChange: number;
  };
  searchValue = '';
  onChange = (value: ICurrencySelectValue) => {};
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
    this.keyUp.pipe(
      map(event => {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        return target.value;
      }),
      debounceTime(300),
    ).subscribe(v => {
      this.input.nativeElement.value = v;
      this.mobileInput.nativeElement.value = v;
      this.onChange({
        currency: this.selected$.getValue(),
        amount: v + '',
        lastChange: new Date().valueOf()
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.disabled && changes.disabled.currentValue) {
      this.opened = false;
    }
  }

  registerOnChange(fn: (value: ICurrencySelectValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setCurrency(currency: ICurrency): void {
    this.selected$.next(currency);
    this.onChange({
      currency,
      amount: this.input.nativeElement.value,
      lastChange: new Date().valueOf()
    });
  }

  writeValue(value: ICurrencySelectValue): void {
    if (!value) {
      return;
    }
    this.selected$.next(value.currency);
    this.input.nativeElement.value = value.amount;
    this.mobileInput.nativeElement.value = value.amount;
    this.value = {
      currency: value.currency,
      amount: value.amount,
      lastChange: new Date().valueOf()
    };
  }

  onCloseDropdown(): void {
    if (this.opened || this.disabled) {
      return;
    }
    this.currenciesFiltered$.next(this.currencies);
    this.searchValue = '';
  }

  search(input: string): void {
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
