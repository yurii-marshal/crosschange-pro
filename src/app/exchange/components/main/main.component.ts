import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CoinsService } from '../../../shared/services/coins.service';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { IExchangeData } from '../../../shared/interfaces/exchange-data.interface';
import { WalletService } from '../../../wallet/services/wallet.service';
import { ExchangeService, IChartPeriods } from '../../../shared/services/exchange.service';
import { IChartData } from '../../../shared/interfaces/chart-data.interface';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { chartOptions } from './chartOptions';
import { IWallet } from '../../../shared/interfaces/wallet.interface';
import { MatDialog } from '@angular/material/dialog';
import { ExchangeConfirmationComponent } from '../exchange-confirmation/exchange-confirmation.component';
import { Devices, MediaBreakpointsService } from '../../../shared/services/media-breakpoints.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit, OnDestroy {
  form: FormGroup;
  onDestroy$ = new Subject<void>();
  exchangeInfo$: BehaviorSubject<IExchangeData> = new BehaviorSubject<IExchangeData>(null);
  wallets$: Observable<IWallet[]>;
  option = chartOptions;
  chartInstance;
  chartPeriods = IChartPeriods;
  chartPeriod: IChartPeriods = IChartPeriods.DAY;
  periodSteps = {
    [this.chartPeriods.DAY]: 30,
    [this.chartPeriods.WEEK]: 30,
    [this.chartPeriods.MONTH]: 30,
    [this.chartPeriods.YEAR]: 30,
  };

  constructor(
    private coins: CoinsService,
    private walletService: WalletService,
    private exchange: ExchangeService,
    private mediaBreakpointsService: MediaBreakpointsService,
    private dialog: MatDialog
  ) {
  }

  onChartInit(e): void {
    this.chartInstance = e;
  }

  ngOnInit(): void {
    this.createForm();
    this.wallets$ = this.walletService.getWallets();

    this.mediaBreakpointsService.device
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((device) => {
        if (device === Devices.MOBILE) {
          this.option.xAxis.axisLabel.rotate = 45;
        }
      });

    combineLatest(
      [
        this.form.get('fromCurrency').valueChanges,
        this.form.get('toCurrency').valueChanges,
      ]
    ).pipe(
      takeUntil(this.onDestroy$),
      filter(([fromCurrency, toCurrency]) => {
        return fromCurrency && toCurrency;
      }),
      map(([from, to]) => {
        return [from.currency, to.currency];
      }),
      distinctUntilChanged(([fOld, tOld], [fNew, tNew]) => {
        return fOld.key === fNew.key && tOld.key === tNew.key;
      }),
      switchMap(([fromCurrency, toCurrency]) => {
        return combineLatest([
          this.coins.getRate(fromCurrency.key, toCurrency.key, this.periodSteps[this.chartPeriod]),
          this.exchange.getChartData(
            fromCurrency.key,
            toCurrency.key,
            this.chartPeriod,
            this.periodSteps[this.chartPeriod])
        ]);
      })
    ).subscribe(([rateInfo, chartData]) => {
      this.exchangeInfo$.next(rateInfo);
      this.setChartInfo(chartData);
    });
  }

  onPeriodChange(val: MatButtonToggleChange): void {
    this.chartPeriod = val.value;
    const from = this.form.get('fromCurrency').value;
    const to = this.form.get('toCurrency').value;
    if (!from || !to) {
      return;
    }
    this.exchange.getChartData(
      from.currency.key,
      to.currency.key,
      this.chartPeriod,
      this.periodSteps[this.chartPeriod]
    ).subscribe(v => {
      this.setChartInfo(v);
    });
  }

  setChartInfo(data: IChartData[]): void {
    // https://echarts.apache.org/examples/en/editor.html?c=area-basic
    const values = data.map(v => v.value);
    const labels = data.map(v => v.name);
    this.option.series = [{
      data: values,
      type: 'line',
      symbol: 'none',
      areaStyle: {},
      lineStyle: {
        color: '#22CF63'
      }
    }];
    this.option.yAxis.min = Math.min(...values) / 1.02;
    this.option.xAxis.data = labels;
    this.chartInstance.setOption({
      series: this.option.series,
      xAxis: this.option.xAxis,
      yAxis: this.option.yAxis,
    });
  }

  createForm(): void {
    this.form = new FormGroup({
      fromCurrency: new FormControl(),
      toCurrency: new FormControl()
    });
  }

  swapCurrencies(): void {
    if (!this.form.get('fromCurrency').value || !this.form.get('toCurrency').value) {
      return;
    }
    this.form.patchValue({
      toCurrency: this.form.get('fromCurrency').value,
      fromCurrency: this.form.get('toCurrency').value
    });
  }

  setFromMaxValue(): void {
    const val = this.form.get('fromCurrency').value;
    if (!val || !val.currency) {
      return;
    }
    const selected = {...val.currency};
    this.wallets$.pipe(
      take(1),
      map((wallets) => {
        const wallet = wallets.filter(v => v.cryptocurrency === selected.key).shift();
        if (!wallet) {
          return 0;
        }
        return wallet.balance.available;
      })
    ).subscribe(amount => {
      this.form.patchValue({
        fromCurrency: {
          currency: selected,
          amount
        }
      });
    });
  }

  openDialog(): void {
    if (!this.form.valid) {
      return;
    }

    const dialogRef = this.dialog.open(ExchangeConfirmationComponent, {
      width: '400px',
      panelClass: 'confirmation',
      data: {
        confirmationStage: 1,
        fromCurrencyAmount: this.form.value.fromCurrency.amount,
        fromCurrencyKey: this.form.value.fromCurrency.currency.key,
        toCurrencyAmount: this.form.value.toCurrency.amount,
        toCurrencyKey: this.form.value.toCurrency.currency.key,
        rate: this.exchangeInfo$.getValue().exchange_rate,
        fee: 2.69
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
