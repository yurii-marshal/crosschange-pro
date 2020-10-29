import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositComponent } from './deposit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { SelectedWalletPipe } from '../../pipes/selected-wallet.pipe';
import { CoinSelectComponent } from '../../../shared/components/coin-select/coin-select.component';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { ClipboardModule } from 'ngx-clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QrCodeComponent } from '../qr-code/qr-code.component';
import { WalletService } from '../../services/wallet.service';
import { depositsMock, WalletServiceMock } from '../../../../../testing/WalletServiceMock';
import { CoinsService } from '../../../shared/services/coins.service';
import { CoinServiceMock, coinsMock } from '../../../../../testing/CoinServiceMock';
import { ActivatedRouteStub } from '../../../../../testing/ActivatedRouteStub';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { skip } from 'rxjs/operators';
import { DepositService } from '../../services/deposit.service';

describe('DepositComponent', () => {
  let component: DepositComponent;
  let fixture: ComponentFixture<DepositComponent>;
  let routeStub: ActivatedRouteStub;
  const router = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    routeStub = new ActivatedRouteStub();
    TestBed.resetTestEnvironment();

    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
      .configureTestingModule({
        imports: [
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([
            {
              path: 'deposit',
              component: DepositComponent
            },
            {
              path: '**',
              redirectTo: '',
              pathMatch: 'full'
            }
          ]),
          MatDialogModule,
          TranslateModule.forRoot(),
          MatIconModule,
          ClipboardModule,
          FormsModule,
          ReactiveFormsModule
        ],
        declarations: [
          DepositComponent,
          CoinSelectComponent,
          PaginatorComponent,
          SelectedWalletPipe,
          QrCodeComponent
        ],
        providers: [
          {
            provide: ENVIRONMENT,
            useValue: environment as IEnvironment
          },
          { provide: MatIconRegistry, useClass: FakeMatIconRegistry },
          { provide: WalletService, useClass: WalletServiceMock },
          { provide: CoinsService, useClass: CoinServiceMock },
          { provide: ActivatedRoute, useValue: routeStub },
          { provide: Router, useValue: router }
        ]
      });

  }));

  beforeEach((done) => {
    routeStub.queryParams.subscribe(v => {
      fixture = TestBed.createComponent(DepositComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      done();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load deposit history', (done) => {
    const coin = { key: 'btc' };
    const expected = { ...depositsMock };
    expected.results = depositsMock.results.map(v => {
      v.cryptocurrency = 'btc';
      return v;
    });
    component.getHistory(coin, { offset: 0, limit: 10 })
      .subscribe(val => {
        expect(val).toEqual(expected);
        done();
      });
  });

  it('should display qr code', async () => {
    await fixture.whenStable();
    const qrCode = fixture.nativeElement.querySelector('app-qr-code .qr img');
    expect(qrCode.getAttribute('src')).toBeTruthy();
  });

  it('should display qr code', async () => {
    await fixture.whenStable();
    const qrCode = fixture.nativeElement.querySelector('app-qr-code .qr img');
    expect(qrCode.getAttribute('src')).toBeTruthy();
  });

  it('should change qr code on select', (done) => {
    fixture.whenStable().then(() => {
      fixture.ngZone.run(() => {
        const xrp = coinsMock.filter(v => v.key === 'xrp').shift();
        component.selected$.pipe(skip(1)).subscribe((value) => {
          expect(value.key).toEqual('xrp');
          done();
        });
        component.onCoinSelect(xrp);
        fixture.detectChanges();
      });
    });
  });


  it('should change offset on coin change', (done) => {
    routeStub.setQueryParamMap({ offset: 10, limit: 10 });
    fixture.whenStable().then(() => {
      fixture.ngZone.run(() => {
        const xrp = coinsMock.filter(v => v.key === 'xrp').shift();
        component.onCoinSelect(xrp);
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalledWith([window.location.pathname], { queryParams: { offset: 0, limit: 10 }});
        done();
      });
    });
  });

  it('should change offset on navigateDefault', (done) => {
    routeStub.setQueryParamMap({ offset: 10, limit: 10 });
    fixture.whenStable().then(() => {
      fixture.ngZone.run(() => {
        component.navigateDefault();
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalledWith([window.location.pathname], { queryParams: { offset: 0, limit: 10 }});
        done();
      });
    });
  });

  it('should get history with defined parameters', (done) => {
    fixture.whenStable().then(() => {
      const service = TestBed.inject(DepositService);
      const spy = spyOn(service, 'getDepositHistory');
      component.getHistory({key: 'btc'}, {offset: 10, limit: 20});
      expect(spy).toHaveBeenCalledWith({
        cryptocurrency: 'btc',
        offset: 10,
        limit: 20
      });
      done();
    });
  });

  it('should select popular', (done) => {
    fixture.whenStable().then(() => {
      fixture.ngZone.run(() => {
        const xrp = coinsMock.filter(v => v.key === 'xrp').shift();
        component.selected$.pipe(skip(1)).subscribe((value) => {
          fixture.whenStable().then(() => {
            expect(value.key).toEqual('xrp');
            const selected = fixture.nativeElement.querySelector('app-coin-select .coin-title');
            expect(selected.innerText).toEqual('Ripple/XRP');
            done();
          });
        });
        component.selectPopular(xrp);
        fixture.detectChanges();
      });
    });
  });

});
