import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  forwardRef, HostListener, Input, OnChanges, OnDestroy,
  OnInit, SimpleChanges, ViewChild
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, map, take, takeUntil } from 'rxjs/operators';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ICurrency } from '../../interfaces/currency.interface';
import { ExchangeService } from '../../services/exchange.service';
import { validate } from './CurrencySelectValidator';
import { ICurrencySelectValue } from './ICurrencySelectValue';
import { ActivatedRoute } from '@angular/router';
import { ActiveLink } from 'src/app/buy-crypto/enums/ActiveLink';
import { CurrencyTypePipe } from 'src/app/shared/pipes/currency-type.pipe';

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
    {provide: NG_VALIDATORS, useValue: validate, multi: true},
  ]
})
export class CurrencySelectComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  @ViewChild('input') input;
  @ViewChild('mobileInput') mobileInput;
  @Input() disabledCondition;
  @Input() secondSelected;
  @Input() currencyType;

  public ActiveLink = ActiveLink;
  currencies: ICurrency[] = [];
  public keyUp = new Subject<[KeyboardEvent, string]>();
  public change = new Subject<[Event, string]>();
  opened = false;
  currenciesFiltered$: BehaviorSubject<ICurrency[]> = new BehaviorSubject<ICurrency[]>([]);
  selected$: BehaviorSubject<ICurrency> = new BehaviorSubject<ICurrency>(null);
  amountForm: FormGroup = new FormGroup({
    amount: new FormControl(''),
  });
  onDestroy$: Subject<void> = new Subject();
  value: {
    currency: ICurrency;
    amount: number | string;
  };
  searchValue = '';
  onChange = (value: ICurrencySelectValue) => {
  }
  onTouched = () => {
  }

  constructor(
    private exchange: ExchangeService,
    private elRef: ElementRef,
  ) {
  }

  @HostListener('document:click', ['$event.target']) onClick(target): void {
    if (this.elRef && this.elRef.nativeElement && !this.elRef.nativeElement.contains(target)) {
      this.opened = false;
    }
  }

  ngOnInit(): void {
    this.exchange.getCurrencies()
      .pipe(
        take(1),
      ).subscribe(v => {
        this.currenciesFiltered$.next(v);
        this.currencies = v;
    });

    this.keyUp.pipe(
      takeUntil(this.onDestroy$),
      map(([event, type]) => {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        return [target.value, type];
      }),
      debounceTime(1000),
    ).subscribe(([v, type]) => {
      this.onInput(type, v);
    });

    this.change.pipe(
      takeUntil(this.onDestroy$),
      map(([event, type]) => {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        return [target.value, type];
      }),
    ).subscribe(([v, type]) => {
      this.onInput(type, v);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.disabledCondition && changes.disabledCondition.currentValue) {
      this.opened = false;
    }
  }

  registerOnChange(fn: (value: ICurrencySelectValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private onInput(type: string, value: number | string): void {
    if (type === 'desktop') {
      this.mobileInput.nativeElement.value = value;
    } else {
      this.input.nativeElement.value = value;
    }
    this.onChange({
      currency: this.selected$.getValue(),
      amount: value + ''
    });
  }

  setCurrency(currency: ICurrency): void {
    this.selected$.next(currency);
    this.onChange({
      currency,
      amount: this.input.nativeElement.value
    });
  }

  writeValue(value: ICurrencySelectValue): void {
    if (!value) {
      return;
    }
    this.selected$.next(value.currency);
    if (this.input) {
      this.input.nativeElement.value = value.amount;
    }
    if (this.mobileInput) {
      this.mobileInput.nativeElement.value = value.amount;
    }
    this.value = {
      currency: value.currency,
      amount: value.amount
    };
  }

  onCloseDropdown(): void {
    if (this.opened || this.disabledCondition) {
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
