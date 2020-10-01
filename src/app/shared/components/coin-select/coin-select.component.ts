import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { CoinsService } from '../../services/coins.service';
import { ICoin } from '../../interfaces/coin.interface';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-coin-select',
  templateUrl: './coin-select.component.html',
  styleUrls: ['./coin-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoinSelectComponent implements OnInit, OnChanges {
  @Input() value: ICoin;
  @Output() valueChanges = new EventEmitter<ICoin>();
  opened = false;
  coins$: Observable<ICoin[]>;
  selected;
  constructor(
    private coinsService: CoinsService
  ) { }

  ngOnInit(): void {
    this.coins$ = this.coinsService.coinsStream;
    this.coinsService.coinsStream.pipe(take(1)).subscribe( v => {
      this.select(v[0]);
    });

    this.coinsService.getCoins();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.value) {
      this.select(changes.value.currentValue);
    }
  }

  select(val): void {
    this.selected = val;
    this.valueChanges.next(val);
  }

}
