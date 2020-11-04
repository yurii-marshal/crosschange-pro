import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  OnInit
} from '@angular/core';
import { CoinsService } from '../../services/coins.service';
import { ICoin } from '../../interfaces/coin.interface';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-coin-select',
  templateUrl: './coin-select.component.html',
  styleUrls: ['./coin-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CoinSelectComponent),
      multi: true
    }
  ]
})
export class CoinSelectComponent implements OnInit, ControlValueAccessor {
  opened = false;
  coins$: Observable<ICoin[]>;
  $popular: Observable<ICoin[]>;
  selected: ICoin;
  onChange = (coin: ICoin) => {
  }
  onTouched = () => {
  }

  constructor(
    private coinsService: CoinsService,
  ) {
  }

  ngOnInit(): void {
    this.coins$ = this.coinsService.getCoins()
      .pipe(
        take(1),
        tap(v => !this.selected && this.writeValue(v[0]))
      );
    this.$popular = this.coinsService.getPopular();
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
}
