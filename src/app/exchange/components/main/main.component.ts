import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CoinsService } from '../../../shared/services/coins.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, of, Subject, zip } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mergeMap, pairwise,
  share,
  switchMap, take,
  takeUntil
} from 'rxjs/operators';
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
import { CurrencySelectValidators } from '../../../shared/components/currency-select/CurrencySelectValidator';

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
  wallets$: BehaviorSubject<IWallet[]> = new BehaviorSubject<IWallet[]>([]);
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
  inputsEnabled = true;
  maxDisabled = false;
  skipNext = false;
  prevValues = ['', ''];
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
    this.getWallets();
    this.mediaBreakpointsService.device
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((device) => {
        if (device === Devices.MOBILE) {
          this.option.xAxis.axisLabel.rotate = 45;
        }
      });
    this.preCheckSubscribe();

    combineLatest(
      [
        this.form.get('fromCurrency').valueChanges.pipe(share()),
        this.form.get('toCurrency').valueChanges.pipe(share()),
      ]
    ).pipe(
      takeUntil(this.onDestroy$),
      distinctUntilChanged(([fOld, tOld], [fNew, tNew]) => {
        return (fOld && fOld.currency && fOld.currency.key) === (fNew && fNew.currency && fNew.currency.key)
          && (tOld && tOld.currency && tOld.currency.key) === (tNew && tNew.currency && tNew.currency.key);
      }),
      filter(([fromCurrency, toCurrency]) => {
        return fromCurrency
          && fromCurrency.currency
          && toCurrency
          && toCurrency.currency;
      }),
      map(([from, to]) => {
        return [from.currency, to.currency];
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

  getWallets(): void {
    this.walletService.getWallets().pipe(takeUntil(this.onDestroy$))
      .subscribe((v) => {
        this.wallets$.next(v);
      });
  }

  preCheckSubscribe(): void {
    combineLatest(
      [
        this.form.get('fromCurrency').valueChanges,
        this.form.get('toCurrency').valueChanges,
      ]
    ).pipe(
      takeUntil(this.onDestroy$),
      distinctUntilChanged(([oldFrom, oldTo], [newFrom, newTo]) => {
        return (oldFrom.currency && oldFrom.currency.key) === (newFrom.currency && newFrom.currency.key)
        && (oldTo.currency && oldTo.currency.key) === (newTo.currency && newTo.currency.key)
        && +oldFrom.amount === +newFrom.amount
        && +oldTo.amount === +newTo.amount;
      }),
      pairwise(),
      filter(([[oldFrom, oldTo], [fromCurrency, toCurrency]]) => {
        if (this.skipNext) {
          this.skipNext = false;
          this.prevValues = [fromCurrency.amount, toCurrency.amount];
          return false;
        }
        return fromCurrency
          && fromCurrency.currency
          && toCurrency
          && toCurrency.currency
          && (fromCurrency.amount || toCurrency.amount);
      }),
      map(([[oldFrom, oldTo], [from, to]]) => {
        let changedKey = '';
        if ((oldFrom.currency && oldFrom.currency.key) !== (from.currency && from.currency.key)) {
          changedKey = 'from';
        }
        if ((oldTo.currency && oldTo.currency.key) !== (to.currency && to.currency.key)) {
          changedKey = 'to';
        }
        return [this.prevValues, [from.amount, to.amount], changedKey];
      }),
      mergeMap(([[fromOld, toOld], [fromNew, toNew], changedKey]) => {
        this.prevValues = [fromNew, toNew];
        this.skipNext = true;
        this.inputsEnabled = false;
        const fromChanged = +fromOld !== +fromNew;
        const toChanged = +toOld !== +toNew;
        const mask = (+fromChanged).toString() + (+toChanged).toString();
        let req: [string, string, number, string];
        let toUpdate: string;
        const lastFrom = this.form.get('fromCurrency').value.lastChange;
        const lastTo = this.form.get('toCurrency').value.lastChange;
        const from = this.form.get('fromCurrency').value.currency.key;
        const to = this.form.get('toCurrency').value.currency.key;
        switch (mask) {
          case '10':
          case '11':
            toUpdate = 'toCurrency';
            req = [from, to, fromNew, from];
            break;
          case '01':
            toUpdate = 'fromCurrency';
            req = [to, from, toNew, from];
            break;
          default:
            if (lastFrom > lastTo) {
              toUpdate = 'toCurrency';
              req = [from, to, fromNew, from];
            } else {
              toUpdate = 'fromCurrency';
              req = [to, from, toNew, from];
            }
        }
        return zip(this.exchange.precheck(...req), of(toUpdate));
      }),
    ).subscribe(([res, updated]) => {
      this.form.get(updated).setValue({
        currency: this.form.get(updated).value.currency,
        amount: res.amount
      });
      this.form.patchValue({
        fee: res.fee,
        rate: res.rate,
        valid: res.valid
      });
      this.inputsEnabled = true;
    }, err => {
      this.inputsEnabled = true;
    });
  }

  onPeriodChange(val: MatButtonToggleChange): void {
    this.chartPeriod = val.value;
    const from = this.form.get('fromCurrency').value;
    const to = this.form.get('toCurrency').value;
    if (!from || !to || !from.currency || !to.currency) {
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

  exchangeValidValidator({value}: FormControl): { [key: string]: boolean } | null {
    return value ? null : { exchange_invalid: true };
  }

  createForm(): void {
    this.form = new FormGroup({
      fromCurrency: new FormControl(null,  [
        CurrencySelectValidators.amountRequired,
        CurrencySelectValidators.cryptoRequired,
        CurrencySelectValidators.amountNotNumber
      ]),
      toCurrency: new FormControl(null,  [
        CurrencySelectValidators.amountRequired,
        CurrencySelectValidators.cryptoRequired,
        CurrencySelectValidators.amountNotNumber
        ]),
      fee: new FormControl(),
      rate: new FormControl(null, Validators.required),
      valid: new FormControl(false, [this.exchangeValidValidator])
    });
  }

  resetForm(): void {
    this.form.reset({
      fromCurrency: { currency: undefined, amount: '' },
      toCurrency: { currency: undefined, amount: '' },
      fee: undefined,
      rate: 0,
      valid: false
    });
    this.prevValues = ['', ''];
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
    if (!val || !val.currency || !this.inputsEnabled || this.maxDisabled) {
      return;
    }
    const selected = {...val.currency};
    let amount = 0;
    const wallet = this.wallets$.getValue().filter(v => v.cryptocurrency === selected.key).shift();
    if (wallet) {
      amount = wallet.balance.available;
    }
    this.form.get('fromCurrency').setValue({
      currency: selected,
      amount
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
        rate: this.form.value.rate,
        fee: this.form.value.fee
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(res => {
      if (res) {
        this.resetForm();
        this.setChartInfo([]);
        this.getWallets();
        this.exchangeInfo$.next(null);
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
