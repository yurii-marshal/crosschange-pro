import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CoinsService } from '../../../shared/services/coins.service';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { IExchangeData } from '../../../shared/interfaces/exchange-data.interface';
import {WalletService} from '../../../wallet/services/wallet.service';

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
  option = {
    backgroundColor: 'white',
    responsive: true,
    tooltip: {
      show: false
    },
    grid: { // https://echarts.apache.org/en/option.html#grid
      left: '50px', // Distance between grid component and the left side of the container.
      right: '10px',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
      axisLine: {
        show: false,
        lineStyle: {
          backgroundColor: 'white'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        showMinLabel: false,
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        showMinLabel: false,
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(34, 207, 99, 0.12)',
          type: 'dashed'
        }
      },
      min: 0
    },
    series: [],
    color: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0, color: 'rgba(23, 199, 89, 0.15)' // color at 0% position
      }, {
        offset: 1, color: 'rgba(30, 182, 87, 0.01)' // color at 100% position
      }],
      global: false // false by default
    }
  };
  currencyType: any;
  chart;

  constructor(
    private coins: CoinsService,
    private wallets: WalletService
  ) { }

  onChartInit(e): void {
   this.chart = e;
  }

  ngOnInit(): void {
    // https://echarts.apache.org/examples/en/editor.html?c=area-basic
    this.coins.getRate('BTC', 'USD', 30).subscribe(v => {
      /*this.option.color = [+v.change_perce_24 >= 0 ? '#52C676' : '#DB1C27'];*/
      this.option.series = [{
        data: v.prices,
        type: 'line',
        symbol: 'none',
        areaStyle: {},
        lineStyle: {
          color: '#22CF63'
        }
      }];
      this.option.yAxis.min = Math.min(...v.prices) / 1.02;
      this.option.xAxis.data = new Array(v.prices.length).fill(1).map((_, i) => i + '');
      this.chart.setOption({
        series: this.option.series,
        xAxis: this.option.xAxis,
        yAxis: this.option.yAxis,
      });
    });

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
