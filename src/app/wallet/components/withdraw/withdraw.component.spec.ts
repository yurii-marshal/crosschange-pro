import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawComponent } from './withdraw.component';
import { ActivatedRouteStub } from '../../../../../testing/ActivatedRouteStub';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { ClipboardModule } from 'ngx-clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoinSelectComponent } from '../../../shared/components/coin-select/coin-select.component';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { SelectedWalletPipe } from '../../pipes/selected-wallet.pipe';
import { QrCodeComponent } from '../qr-code/qr-code.component';
import { environment } from '../../../../environments/environment';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { WalletService } from '../../services/wallet.service';
import { WalletServiceMock } from '../../../../../testing/WalletServiceMock';
import { CoinsService } from '../../../shared/services/coins.service';
import { CoinServiceMock, coinsMock } from '../../../../../testing/CoinServiceMock';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { WithdrawServiceMock, withdrawsMock } from '../../../../../testing/WithdrawServiceMock';
import { WithdrawService } from '../../services/withdraw.service';
import { AddressSelectComponent } from '../../../shared/components/address-select/address-select.component';
import { skip } from 'rxjs/operators';
import { DepositService } from '../../services/deposit.service';

describe('WithdrawComponent', () => {
  let component: WithdrawComponent;
  let fixture: ComponentFixture<WithdrawComponent>;
  let routeStub: ActivatedRouteStub;
  const router = {
    navigate: jasmine.createSpy('navigate')
  };

  let withdrawService: WithdrawServiceMock;

  beforeEach(async(() => {
    routeStub = new ActivatedRouteStub();
    TestBed.resetTestEnvironment();

    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
      .configureTestingModule({
        imports: [
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([
            {
              path: 'withdraw',
              component: WithdrawComponent
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
          WithdrawComponent,
          CoinSelectComponent,
          AddressSelectComponent,
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

    withdrawService = TestBed.inject(WithdrawServiceMock);
  }));

  beforeEach((done) => {
    routeStub.queryParams.subscribe(v => {
      fixture = TestBed.createComponent(WithdrawComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      done();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load withdraw history', (done) => {
    const expected = { ...withdrawsMock };
    withdrawService.getWithdrawHistory({ offset: 0, limit: 10 })
      .subscribe(val => {
        expect(val).toEqual(expected);
        done();
      });
  });

  it('should get history with defined parameters', (done) => {
    // fixture.whenStable().then(() => {
    //   const service = TestBed.inject(DepositService);
    //   const spy = spyOn(service, 'getDepositHistory');
    //   component.getHistory({key: 'btc'}, {offset: 10, limit: 20});
    //   expect(spy).toHaveBeenCalledWith({
    //     cryptocurrency: 'btc',
    //     offset: 10,
    //     limit: 20
    //   });
    //   done();
    // });
  });

  it('should establish a coin information on coin change', (done) => {
    // routeStub.setQueryParamMap({ offset: 10, limit: 10 });
    // fixture.whenStable().then(() => {
    //   fixture.ngZone.run(() => {
    //     const xrp = coinsMock.filter(v => v.key === 'xrp').shift();
    //     component.onCoinSelect(xrp);
    //     fixture.detectChanges();
    //     expect(router.navigate).toHaveBeenCalledWith([window.location.pathname], { queryParams: { offset: 0, limit: 10 }});
    //     done();
    //   });
    // });
  });

  it('should change fee result on coin change when an amount is filled', (done) => {
    // routeStub.setQueryParamMap({ offset: 10, limit: 10 });
    // fixture.whenStable().then(() => {
    //   fixture.ngZone.run(() => {
    //     const xrp = coinsMock.filter(v => v.key === 'xrp').shift();
    //     component.onCoinSelect(xrp);
    //     fixture.detectChanges();
    //     expect(router.navigate).toHaveBeenCalledWith([window.location.pathname], { queryParams: { offset: 0, limit: 10 }});
    //     done();
    //   });
    // });
  });

  it('should change fee result on recipient address change when an amount is filled', (done) => {
    // routeStub.setQueryParamMap({ offset: 10, limit: 10 });
    // fixture.whenStable().then(() => {
    //   fixture.ngZone.run(() => {
    //     const xrp = coinsMock.filter(v => v.key === 'xrp').shift();
    //     component.onCoinSelect(xrp);
    //     fixture.detectChanges();
    //     expect(router.navigate).toHaveBeenCalledWith([window.location.pathname], { queryParams: { offset: 0, limit: 10 }});
    //     done();
    //   });
    // });
  });

  it('should change fee result on an amount number changes', (done) => {
    // routeStub.setQueryParamMap({ offset: 10, limit: 10 });
    // fixture.whenStable().then(() => {
    //   fixture.ngZone.run(() => {
    //     const xrp = coinsMock.filter(v => v.key === 'xrp').shift();
    //     component.onCoinSelect(xrp);
    //     fixture.detectChanges();
    //     expect(router.navigate).toHaveBeenCalledWith([window.location.pathname], { queryParams: { offset: 0, limit: 10 }});
    //     done();
    //   });
    // });
  });

  it('should select popular and change fee result when an amount is filled', (done) => {
    // fixture.whenStable().then(() => {
    //   fixture.ngZone.run(() => {
    //     const xrp = coinsMock.filter(v => v.key === 'xrp').shift();
    //     component.selected$.pipe(skip(1)).subscribe((value) => {
    //       fixture.whenStable().then(() => {
    //         expect(value.key).toEqual('xrp');
    //         const selected = fixture.nativeElement.querySelector('app-coin-select .coin-title');
    //         expect(selected.innerText).toEqual('Ripple/XRP');
    //         done();
    //       });
    //     });
    //     component.selectPopular(xrp);
    //     fixture.detectChanges();
    //   });
    // });
  });

  it('should submit withdraw transaction on button Submit click', (done) => {
    // routeStub.setQueryParamMap({ offset: 10, limit: 10 });
    // fixture.whenStable().then(() => {
    //   fixture.ngZone.run(() => {
    //     const xrp = coinsMock.filter(v => v.key === 'xrp').shift();
    //     component.onCoinSelect(xrp);
    //     fixture.detectChanges();
    //     expect(router.navigate).toHaveBeenCalledWith([window.location.pathname], { queryParams: { offset: 0, limit: 10 }});
    //     done();
    //   });
    // });
  });

});
