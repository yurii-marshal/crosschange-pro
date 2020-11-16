import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { CoinsService } from '../../../shared/services/coins.service';
import { CoinServiceMock } from '../../../../../testing/CoinServiceMock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { ENVIRONMENT, IEnvironment } from 'shared-kuailian-lib';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencySelectComponent } from '../../../shared/components/currency-select/currency-select.component';
import { SelectedWalletBalancePipe } from '../../pipes/selected-wallet-balance.pipe';
import { SelectedWalletKeyPipe } from '../../pipes/selected-wallet-key.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry, MatIconTestingModule } from '@angular/material/icon/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgxEchartsModule } from 'ngx-echarts';
import { ExchangeService } from '../../../shared/services/exchange.service';
import { currenciesMock, ExchangeServiceMock } from '../../../../../testing/ExchangeServiceMock';
import { WalletService } from '../../../wallet/services/wallet.service';
import { WalletServiceMock, walletsMock } from '../../../../../testing/WalletServiceMock';
import { MainTestHelper } from '../../../../../testing/MainTestHelper';
import { of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { take } from 'rxjs/operators';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { CurrencySelectedPipe } from '../../../shared/pipes/currency-selected.pipe';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../../../../testing/ActivatedRouteStub';
import { RouterTestingModule } from '@angular/router/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { CurrencyTypePipe } from '../../../shared/pipes/currency-type.pipe';
import { ActiveLink } from '../../enums/ActiveLink';
import {ExchangeConfirmationComponent} from '../exchange-confirmation/exchange-confirmation.component';

async function setFormValue(component, fixture, from, to, fromAmount, toAmount, fee = 0, rate = 0, valid = true, paymentMethod = 'spot-wallet'): Promise<void> {
  component.form.setValue({
    fromCurrency: {
      currency: from,
      amount: fromAmount
    },
    toCurrency: {
      currency: to,
      amount: toAmount
    },
    fee,
    rate,
    valid,
    paymentMethod
  });
  fixture.detectChanges();
  await fixture.whenStable();
}

// TODO: FIX
fdescribe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  const routeStub = new ActivatedRouteStub();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserModule,
        HttpClientTestingModule,
        MatDialogModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatIconModule,
        MatIconTestingModule,
        MatButtonToggleModule,
        RouterTestingModule.withRoutes([
          {
            path: '',
            component: MainComponent
          },
          {
            path: '**',
            redirectTo: '',
            pathMatch: 'full'
          }
        ]),
        MatTabsModule,
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts'),
        }),
      ],
      declarations: [
        MainComponent,
        CurrencySelectComponent,
        SelectedWalletBalancePipe,
        SelectedWalletKeyPipe,
        CurrencySelectedPipe,
        CurrencyTypePipe
      ],
      providers: [
        {
          provide: ENVIRONMENT,
          useValue: environment as IEnvironment
        },
        {provide: MatIconRegistry, useClass: FakeMatIconRegistry},
        {provide: CoinsService, useClass: CoinServiceMock},
        {provide: ExchangeService, useClass: ExchangeServiceMock},
        {provide: WalletService, useClass: WalletServiceMock},
        {provide: ActivatedRoute, useValue: routeStub},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have button enabled/disabled', async () => {
    await setFormValue(component, fixture, currenciesMock[0], currenciesMock[1], 0, 0, 1, 1, true);
    let button = fixture.nativeElement.querySelector('.left button');
    expect(button.getAttribute('disabled')).toEqual('');
    expect(component.form.valid).toEqual(false);

    component.form.get('fromCurrency').setValue({
      currency: currenciesMock[0],
      amount: 1
    });
    fixture.detectChanges();
    await fixture.whenStable();
    button = fixture.nativeElement.querySelector('.left button');
    expect(button.getAttribute('disabled')).toEqual(null);
    expect(component.form.valid).toEqual(true);

    component.form.get('fromCurrency').setValue({
      currency: currenciesMock[0],
      amount: '1a'
    });
    fixture.detectChanges();
    await fixture.whenStable();
    button = fixture.nativeElement.querySelector('.left button');
    expect(button.getAttribute('disabled')).toEqual('');
    expect(component.form.valid).toEqual(false);
  });

  it('should create form', async () => {
    await fixture.whenStable();
    expect(component.form).toBeTruthy();
    expect(component.form.controls).toBeTruthy();
    expect(Object.keys(component.form.controls).length).toBeTruthy();
    component.form = undefined;
    component.createForm();
    expect(component.form).toBeTruthy();
    expect(component.form.controls).toBeTruthy();
    expect(Object.keys(component.form.controls)).toBeTruthy();
  });

  it('should create and draw chart', async () => {
    await setFormValue(component, fixture, currenciesMock[0], currenciesMock[1], 0, 0);
    // Wait for chart render
    await MainTestHelper.sleep(2500);
    expect(component.chartInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.chart-container canvas')).toBeTruthy();
  });

  it('swap input values', async () => {
    await setFormValue(component, fixture, currenciesMock[0], currenciesMock[1], 0, 0);
    component.swapCurrencies();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.get('fromCurrency').value).toEqual({currency: currenciesMock[1], amount: 0});
    expect(component.form.get('toCurrency').value).toEqual({currency: currenciesMock[0], amount: 0});
  });

  it('should display statistics', async (done) => {
    const service = TestBed.inject(CoinsService);
    const statsOne = fixture.nativeElement.querySelector('.status-item span');
    const statsTwo = fixture.nativeElement.querySelector('.status-item div');
    const getRateMock = {
      is_favorite: false,
      exchange_type: '1',
      last: '1.5',
      exchange_rate: '1.5',
      change_percent_24: '50',
      high_24: '1',
      low_24: '1',
      market_cap: '1',
      vol_24: '1',
      pair: '1',
      cng: '1',
      high: '1',
      low: '1',
      vol: '1',
      mktCap: '1',
      prices: [],
    };

    spyOn(service, 'getRate').and.returnValue(of(getRateMock));

    await setFormValue(component, fixture, currenciesMock[1], currenciesMock[2], 1, 2);

    component.exchangeInfo$.next(getRateMock);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(statsOne.innerText).toEqual('1.5000');
      expect(statsTwo.innerText).toEqual('+ 0.5000\n(+50.00%)');
      done();
    });
  });

  it('should set balance value from max available button', async (done) => {
    const input = fixture.nativeElement.querySelector('app-currency-select .amount-input');

    component.wallets$.next(walletsMock.map(v => {
      v.balance.available = 100;
      return v;
    }));

    await setFormValue(component, fixture, currenciesMock[0], currenciesMock[1], 10, 10);

    component.setFromMaxValue();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(input.value).toEqual('100');
      done();
    });
  });

  it('should display balance', (done) => {
    const service = TestBed.inject(WalletService);
    const fromBalance = fixture.nativeElement.querySelector('.max-balance');
    const toBalance = fixture.nativeElement.querySelector('.form-field .max span:not(.max-label)');

    spyOn(service, 'getWallets').and.returnValue(of(walletsMock.map(v => {
      v.balance.available = 100;
      return v;
    })));

    setFormValue(component, fixture, currenciesMock[0], currenciesMock[1], 0, 0);

    component.getWallets();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      // innerText remove empty spaces to be equal to float number
      expect(fromBalance.innerText.replace(/\s/g, '')).toEqual('100.0');
      expect(toBalance.innerText.replace(/\s/g, '')).toEqual('100.0');
      done();
    });

  });

  it('should open confirm component', async (done) => {
    await setFormValue(component, fixture, currenciesMock[1], currenciesMock[2], 1, 2);

    component.exchangeInfo$.next(null);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const button = fixture.nativeElement.querySelector('.left button');
      MainTestHelper.click(button);
      fixture.detectChanges();
      fromPromise(fixture.whenStable()).subscribe(() => {
        const dialog = document.querySelector('app-exchange-confirmation');
        fixture.detectChanges();
        expect(dialog).toBeTruthy();
        done();
      });
    });
  });


  /*it('should open confirm component with params', async (done) => {
    await setFormValue(component, fixture, currenciesMock[1], currenciesMock[2], 1, 2);

    component.exchangeInfo$.next(null);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const dialogRef = TestBed.inject(MatDialog);
      const button = fixture.nativeElement.querySelector('.left button');
      const spy = spyOn(dialogRef, 'open');
      MainTestHelper.click(button);
      expect(spy).toHaveBeenCalledWith(ExchangeConfirmationComponent, {
        width: '400px',
        panelClass: 'confirmation',
        data: {
          confirmationStage: 1,
          activeLink: component.activeLink,
          fromCurrencyAmount: component.form.value.fromCurrency.amount,
          fromCurrencyKey: component.form.value.fromCurrency.currency.key,
          toCurrencyAmount: component.form.value.toCurrency.amount,
          toCurrencyKey: component.form.value.toCurrency.currency.key,
          rate: component.form.value.rate,
          fee: component.form.value.fee,
          paymentMethod: component.form.value.paymentMethod
        }
      });
      fixture.detectChanges();
      done();
    });
  });*/

  it('should recalculate value', (done) => {
    setFormValue(component, fixture, currenciesMock[1], currenciesMock[2], 1, 2).then(() => {
      component.form.get('valid').valueChanges.pipe(take(1)).subscribe(() => {
        const toCurrValue = component.form.get('toCurrency').value.amount;
        const fromCurrValue = component.form.get('fromCurrency').value.amount;
        const notEq = toCurrValue !== 2;
        expect(notEq).toEqual(true);
        expect(fromCurrValue).toEqual(1);
        component.form.get('valid').valueChanges.pipe(take(1)).subscribe(() => {
          fixture.whenStable().then(() => {
            expect(component.form.get('toCurrency').value.amount).toEqual(3);
            expect(fromCurrValue !== component.form.get('fromCurrency').value.amount).toEqual(true);
            done();
          });
        });
        component.form.get('toCurrency').setValue({
          currency: currenciesMock[0],
          amount: 3
        });
      });
      component.form.get('fromCurrency').setValue({
        currency: currenciesMock[0],
        amount: 1
      });
    });
  });

  it('should change tab', async () => {
    await fixture.whenStable();
    routeStub.setQueryParamMap({ tab: ActiveLink.EXCHANGE });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.activeLink).toEqual(ActiveLink.EXCHANGE);
    let button = fixture.nativeElement.querySelector('.fx-row .left button');
    expect(button.innerText).toEqual('buy_crypto.exchange');
    routeStub.setQueryParamMap({ tab: ActiveLink.BUY });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.activeLink).toEqual(ActiveLink.BUY);
    button = fixture.nativeElement.querySelector('.fx-row .left button');
    expect(button.innerText).toEqual('buy_crypto.buy btc');
  });

  it('should payment methods based on tab', async () => {
    await fixture.whenStable();
    routeStub.setQueryParamMap({ tab: ActiveLink.EXCHANGE });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.activeLink).toEqual(ActiveLink.EXCHANGE);
    let methods = fixture.nativeElement.querySelectorAll('.payment-method__label');
    expect(methods.length).toEqual(0);
    routeStub.setQueryParamMap({ tab: ActiveLink.BUY });
    fixture.detectChanges();
    await fixture.whenStable();
    methods = fixture.nativeElement.querySelectorAll('.payment-method__label');
    const buyExpected = [
      'buy_crypto.spot_wallet',
      'buy_crypto.coming_soon',
      'buy_crypto.coming_soon'
    ];
    expect(methods.length).toEqual(3);
    for (let i = 0; i < methods.length; i++) {
      expect(methods[i].innerText).toEqual(buyExpected[i]);
    }
  });

});
