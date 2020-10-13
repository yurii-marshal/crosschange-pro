import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  OnInit
} from '@angular/core';
import { CoinsService } from '../../services/coins.service';
import { ICoin } from '../../interfaces/coin.interface';
import {Observable, Subject, zip} from 'rxjs';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';

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
export class CurrencySelectComponent implements OnInit, ControlValueAccessor {
  opened = false;
  coins$: Observable<ICoin[]>;
  selected: ICoin;
  amount: FormControl = new FormControl();
  onDestroy$: Subject<void> = new Subject()
  onChange = (coin: ICoin) => {};
  onTouched = () => {};
  constructor(
    private coinsService: CoinsService
  ) { }

  ngOnInit(): void {
    this.coins$ = zip(
      this.coinsService.getCoins()
    )
      .pipe(
        take(1),
        map(([coins]) => {
          return coins;
        })
      );
  }

  registerOnChange(fn: (coin: ICoin) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(coin: ICoin): void {
    if (!coin) {
      return;
    }
    this.selected = coin;
    this.onChange(coin);
  }

  onDestroy(): void {

  }
}
