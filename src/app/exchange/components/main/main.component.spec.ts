import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { MainComponent } from './main.component';
import { CoinsService } from '../../../shared/services/coins.service';
import { CoinServiceMock } from '../../../../../testing/CoinServiceMock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { ENVIRONMENT, IEnvironment } from 'shared-kuailian-lib';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencySelectComponent } from '../../../shared/components/currency-select/currency-select.component';
import { SelectedWalletBalancePipe } from '../../pipes/selected-wallet-balance.pipe';
import { SelectedWalletKeyPipe } from '../../pipes/selected-wallet-key.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgxEchartsModule } from 'ngx-echarts';
import { ExchangeService } from '../../../shared/services/exchange.service';
import { currenciesMock, ExchangeServiceMock } from '../../../../../testing/ExchangeServiceMock';
import { WalletService } from '../../../wallet/services/wallet.service';
import { WalletServiceMock, walletsMock } from '../../../../../testing/WalletServiceMock';
import { MainTestHelper } from '../../../../../testing/MainTestHelper';
import { of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import {skip, take} from 'rxjs/operators';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

async function setFormValue(component, fixture, from, to, fromAmount, toAmount, fee = 0, rate = 0, valid = true): Promise<void> {
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
    valid
  });
  fixture.detectChanges();
  await fixture.whenStable();
}


describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientTestingModule,
        MatDialogModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatIconModule,
        MatButtonToggleModule,
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts'),
        }),
      ],
      declarations: [
        MainComponent,
        CurrencySelectComponent,
        SelectedWalletBalancePipe,
        SelectedWalletKeyPipe
      ],
      providers: [
        {
          provide: ENVIRONMENT,
          useValue: environment as IEnvironment
        },
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry },
        { provide: CoinsService, useClass: CoinServiceMock },
        { provide: ExchangeService, useClass: ExchangeServiceMock },
        { provide: WalletService, useClass: WalletServiceMock }
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

    component.form.get('fromCurrency').setValue({
      currency: currenciesMock[0],
      amount: 1
    });
    fixture.detectChanges();
    await fixture.whenStable();
    button = fixture.nativeElement.querySelector('.left button');
    expect(button.getAttribute('disabled')).toEqual(null);

    component.form.get('fromCurrency').setValue({
      currency: currenciesMock[0],
      amount: '1a'
    });
    fixture.detectChanges();
    await fixture.whenStable();
    button = fixture.nativeElement.querySelector('.left button');
    expect(button.getAttribute('disabled')).toEqual('');

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

  it('should display statistics', (done) => {
    const service = TestBed.inject(CoinsService);
    spyOn(service, 'getRate').and.returnValue(of({
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
    }));

    setFormValue(component, fixture, currenciesMock[1], currenciesMock[2], 1, 2);

    // skip initial value
    component.exchangeInfo$.pipe(skip(1)).subscribe((v) => {
      fixture.detectChanges();
      fromPromise(fixture.whenStable()).subscribe(() => {
        const statsOne = fixture.nativeElement.querySelector('.status-item span');
        const statsTwo = fixture.nativeElement.querySelector('.status-item div');
        expect(statsOne.innerText).toEqual('1.5000');
        expect(statsTwo.innerText).toEqual('0.5000\n(50.00%)');
        done();
      });
    });
  });

  it('should set balance value as from amount', async () => {
    const service = TestBed.inject(WalletService);
    spyOn(service, 'getWallets').and.returnValue(of(walletsMock.map(v => {
      v.balance.available = 100;
      return v;
    })));
    await setFormValue(component, fixture, currenciesMock[0], currenciesMock[1], 0, 0);
    component.setFromMaxValue();
    fixture.detectChanges();
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('app-currency-select .amount-input');
    expect(input.value).toEqual('100');
  });

  it('should display balance', (done) => {
    const service = TestBed.inject(WalletService);
    spyOn(service, 'getWallets').and.returnValue(of(walletsMock.map(v => {
      v.balance.available = 100;
      return v;
    })));
    setFormValue(component, fixture, currenciesMock[0], currenciesMock[1], 0, 0);
    component.getWallets();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const fromBalance = fixture.nativeElement.querySelector('.max-balance');
      const toBalance = fixture.nativeElement.querySelector('.form-field .max span:not(.max-label)');
      expect(fromBalance.innerText).toEqual('100.0');
      expect(toBalance.innerText).toEqual('100.0');
      done();
    });

  });

  it('should open confirm component', (done) => {
    setFormValue(component, fixture, currenciesMock[1], currenciesMock[2], 1, 2).then(() => {
      component.exchangeInfo$.pipe(skip(1)).subscribe((v) => {
        fixture.detectChanges();
        fromPromise(fixture.whenStable()).subscribe(() => {
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
    });
  });

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

});
