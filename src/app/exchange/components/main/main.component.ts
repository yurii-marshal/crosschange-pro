import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CoinsService } from '../../../shared/services/coins.service';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { IExchangeData } from '../../../shared/interfaces/exchange-data.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  onDestroy$ = new Subject<void>();
  exchangeInfo: IExchangeData;
  constructor(
    private coins: CoinsService
  ) { }

  ngOnInit(): void {
    this.createForm();
    combineLatest(
      [
        this.form.get('fromCurrency').valueChanges,
        this.form.get('toCurrency').valueChanges
      ]
    ).pipe(
      takeUntil(this.onDestroy$),
      filter(([fromCurrency, toCurrency]) => {
        return fromCurrency && toCurrency;
      }),
      switchMap(([fromCurrency, toCurrency]) => {
        return this.coins.getRate(fromCurrency.key, toCurrency.key, 30);
      })
    ).subscribe((data) => {
      this.exchangeInfo = data;
    });
  }

  createForm(): void {
    this.form = new FormGroup({
      fromCurrency: new FormControl(),
      toCurrency: new FormControl(),
      fromAmount: new FormControl(),
      toAmount: new FormControl(),
      exchangeRate: new FormControl()
    });
  }

  isPositiveChange(): boolean {
    return +this.exchangeInfo.change_perce_24 >= 0;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
