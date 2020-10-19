import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CoinsService } from '../../../shared/services/coins.service';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { IExchangeData } from '../../../shared/interfaces/exchange-data.interface';
import { WalletService } from '../../../wallet/services/wallet.service';
import { ExchangeService, IChartPeriods } from '../../../shared/services/exchange.service';
import { IChartData } from '../../../shared/interfaces/chart-data.interface';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { chartOptions } from './chartOptions';

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
  exchangeInfo$: BehaviorSubject<IExchangeData> = new BehaviorSubject<IExchangeData>(null);
  option = chartOptions;
  currencyType: any;
  chartInstance;
  chartPeriods = IChartPeriods;
  chartPeriod: IChartPeriods = IChartPeriods.DAY;
  constructor(
    private coins: CoinsService,
    private wallets: WalletService,
    private exchange: ExchangeService
  ) { }

  onChartInit(e): void {
   this.chartInstance = e;
  }

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
      map(([from, to]) => {
        return [from.currency, to.currency];
      }),
      distinctUntilChanged(([fOld, tOld], [fNew, tNew]) => {
        return fOld.key === fNew.key && tOld.key === tNew.key;
      }),
      switchMap(([fromCurrency, toCurrency]) => {
        return combineLatest([
          this.coins.getRate(fromCurrency.key, toCurrency.key, 30),
          this.exchange.getChartData(fromCurrency.key, toCurrency.key, this.chartPeriod, 30)
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
    this.exchange.getChartData(from.currency.key, to.currency.key, this.chartPeriod, 30).subscribe(v => {
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

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
