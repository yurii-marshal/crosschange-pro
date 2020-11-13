import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CoinsService } from '../../../shared/services/coins.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, pairwise, startWith, switchMap, take, takeUntil, tap, } from 'rxjs/operators';
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
import { ExchangeHelperService } from '../../services/exchange-helper.service';
import { TranslateService } from '@ngx-translate/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

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
  option = JSON.parse(JSON.stringify(chartOptions));
  chartInstance;
  chartPeriods = IChartPeriods;
  chartPeriod: IChartPeriods = IChartPeriods.DAY;
  periodSteps = {
    [this.chartPeriods.DAY]: 1000,
    [this.chartPeriods.WEEK]: 1000 * 7,
    [this.chartPeriods.MONTH]: 1000 * 7 * 30,
    [this.chartPeriods.YEAR]: 1000 * 7 * 4
  };

  inputsEnabled = true;
  maxDisabled = false;
  targetControlName;
  updateControlName;

  constructor(
    private coins: CoinsService,
    private walletService: WalletService,
    private exchange: ExchangeService,
    private mediaBreakpointsService: MediaBreakpointsService,
    private dialog: MatDialog,
    private helper: ExchangeHelperService,
    private translate: TranslateService
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
        } else {
          this.option.xAxis.axisLabel.rotate = 0;
        }
      });

    combineLatest([
      this.form.get('fromCurrency').valueChanges.pipe(startWith({})),
      this.form.get('toCurrency').valueChanges.pipe(startWith({})),
    ])
      .pipe(
        takeUntil(this.onDestroy$),
        pairwise(),
        filter((
          [[oldFrom, oldTo], [fromCurrency, toCurrency]]) =>
          !((oldTo.amount && toCurrency.amount === '') || (oldFrom.amount && fromCurrency.amount === ''))
        ),
        // TODO: refactor
        tap(([[oldFrom, oldTo], [fromCurrency, toCurrency]]) => {
          const {target, update} = this.helper.setConvertDirection([oldFrom, oldTo], [fromCurrency, toCurrency]);
          this.targetControlName = target;
          this.updateControlName = update;
        }),
        map(([[oldFrom, oldTo], [fromCurrency, toCurrency]]) => [fromCurrency, toCurrency]),
        distinctUntilChanged(this.helper.distinctControlsData),
        filter(this.helper.bothCurrenciesSet),
      )
      .subscribe(() => {
        this.convertCurrency(this.targetControlName, this.updateControlName);
      });

    combineLatest([
      this.form.get('fromCurrency').valueChanges,
      this.form.get('toCurrency').valueChanges,
    ])
      .pipe(
        takeUntil(this.onDestroy$),
        distinctUntilChanged(this.helper.distinctCurrency),
        filter(this.helper.bothCurrenciesSet),
        map(([from, to]) => [from.currency, to.currency]),
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
      )
      .subscribe(([rateInfo, chartData]) => {
        this.exchangeInfo$.next(rateInfo);
        this.setChartInfo(chartData);
      });

    this.exchange.getCurrencies()
      .pipe(take(1))
      .subscribe((currencies) => {
        this.form.patchValue({
          fromCurrency: {
            currency: currencies[0],
            amount: ''
          },
          toCurrency: {
            currency: currencies[1],
            amount: ''
          }
        });
      });
  }

  getWallets(): void {
    this.walletService.getWallets().pipe(takeUntil(this.onDestroy$))
      .subscribe((v) => {
        this.wallets$.next(v);
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


  exchangeValidValidator({value}: FormControl): { [key: string]: boolean } | null {
    return value ? null : {exchange_invalid: true};
  }

  resetForm(): void {
    this.form.reset({
      fromCurrency: {currency: undefined, amount: ''},
      toCurrency: {currency: undefined, amount: ''},
      fee: undefined,
      rate: 0,
      valid: false
    });
  }

  swapCurrencies(): void {
    if (!this.form.get('fromCurrency').value || !this.form.get('toCurrency').value) {
      return;
    }
    this.form.patchValue({
      toCurrency: this.form.get('fromCurrency').value,
      fromCurrency: this.form.get('toCurrency').value
    }, {emitEvent: false});
    this.convertCurrency('fromCurrency', 'toCurrency');
  }

  setFromMaxValue(): void {
    const val = this.form.get('fromCurrency').value;
    if (!val || !val.currency || Number(val.amount) === 0 || !this.inputsEnabled || this.maxDisabled) {
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
    }, {emitEvent: false});
    this.convertCurrency('fromCurrency', 'toCurrency');
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
        this.setChartInfo({} as IChartData);
        this.getWallets();
        this.exchangeInfo$.next(null);
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  createForm(): void {
    this.form = new FormGroup({
      fromCurrency: new FormControl(null, [
        CurrencySelectValidators.amountRequired,
        CurrencySelectValidators.cryptoRequired,
        CurrencySelectValidators.amountNotNumber
      ]),
      toCurrency: new FormControl(null, [
        CurrencySelectValidators.amountRequired,
        CurrencySelectValidators.cryptoRequired,
        CurrencySelectValidators.amountNotNumber
      ]),
      fee: new FormControl(),
      rate: new FormControl(null, Validators.required),
      valid: new FormControl(false, [this.exchangeValidValidator])
    });
  }

  setChartInfo(data: IChartData): void {
    // https://echarts.apache.org/examples/en/editor.html?c=area-basic
    this.option.series = [{
      data: data.points,
      type: 'line',
      symbol: 'none',
      areaStyle: {},
      lineStyle: {
        color: '#22CF63'
      }
    }];
    this.option.yAxis.min = Math.min(...data.points) / 1.02;
    this.option.xAxis.data = data.axis;
    this.translateXAxisLabels(data.axis);
    if (this.chartInstance) {
      this.chartInstance.setOption({
        series: this.option.series,
        xAxis: this.option.xAxis,
        yAxis: this.option.yAxis,
      });
    }
  }

  // TODO: REFACTOR
  private translateXAxisLabels(data: string[]): void {
    (data || []).forEach((v, i) => {
      let key;
      switch (this.chartPeriod) {
        case IChartPeriods.DAY:
          this.chartInstance.setOption({ grid: { left: '30px' } });
          this.option.xAxis.data[i] = v + ':00';
          this.chartInstance.setOption({
            xAxis: this.option.xAxis
          });
          return;
        case IChartPeriods.WEEK:
          this.chartInstance.setOption({ grid: { left: '50px' } });
          key = `weekdays_abbrs.${(v + '').toLowerCase()}`;
          break;
        case IChartPeriods.YEAR:
          this.chartInstance.setOption({ grid: { left: '50px' } });
          key = `months_abbrs.${(v + '').toLowerCase()}`;
          break;
        default:
          this.chartInstance.setOption({ grid: { left: '30px' } });
          this.option.xAxis.data[i] = v;
          this.chartInstance.setOption({
            xAxis: this.option.xAxis
          });
          return;
      }
      this.translate.get(key).pipe(take(1)).subscribe((tr) => {
        this.option.xAxis.data[i] = tr;
        this.chartInstance.setOption({
          xAxis: this.option.xAxis
        });
      });
    });
  }

  convertCurrency(target, toUpdate): void {
    if (this.helper.convertFilter(this.form, target, toUpdate)) {
      if (Number(this.form.get(target).value.amount) === 0) {
        this.form.get(toUpdate).patchValue({
          amount: 0,
          currency: this.form.get(toUpdate).value.currency
        }, {emitEvent: false});

        this.form.patchValue({
          fee: 0,
          rate: 0,
          valid: false
        }, {emitEvent: false});

        return;
      }

      this.inputsEnabled = false;

      this.helper.preCheckRequest(this.form, target, toUpdate)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((res) => {
          this.form.get(toUpdate).setValue({
            currency: this.form.get(toUpdate).value.currency,
            amount: res.amount
          }, {emitEvent: false});
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
  }
}

_([
  'weekdays_abbrs.sun',
  'weekdays_abbrs.mon',
  'weekdays_abbrs.tue',
  'weekdays_abbrs.wed',
  'weekdays_abbrs.thu',
  'weekdays_abbrs.fri',
  'weekdays_abbrs.sat',
  'months_abbrs.jan',
  'months_abbrs.feb',
  'months_abbrs.mar',
  'months_abbrs.apr',
  'months_abbrs.may',
  'months_abbrs.jun',
  'months_abbrs.jul',
  'months_abbrs.aug',
  'months_abbrs.sep',
  'months_abbrs.oct',
  'months_abbrs.nov',
  'months_abbrs.dec'
]);
