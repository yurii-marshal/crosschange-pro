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
import { AddressSelectComponent } from '../../../shared/components/address-select/address-select.component';
import { skip, take } from 'rxjs/operators';
import { ICoin } from '../../../shared/interfaces/coin.interface';
import { IWalletAddress } from '../../../shared/interfaces/address.interface';
import { IWallet } from '../../../shared/interfaces/wallet.interface';

const addressMock: IWalletAddress = {
  id: 54565,
  key: 'eth',
  label: 'Wallet Label 1',
  address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
  memo: 'one',
  tag: 'tagg1',
  isWhitelisted: true,
};

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
          {provide: MatIconRegistry, useClass: FakeMatIconRegistry},
          {provide: WalletService, useClass: WalletServiceMock},
          {provide: CoinsService, useClass: CoinServiceMock},
          {provide: ActivatedRoute, useValue: routeStub},
          {provide: Router, useValue: router}
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
    const expected = {...withdrawsMock};
    withdrawService.getWithdrawHistory({offset: 0, limit: 10})
      .subscribe(val => {
        expect(val).toEqual(expected);
        done();
      });
  });

  it('should get history with defined parameters', (done) => {
    fixture.whenStable().then(() => {
      const spy = spyOn(withdrawService, 'getWithdrawHistory');
      withdrawService.getWithdrawHistory({offset: 20, limit: 10});
      expect(spy).toHaveBeenCalledWith({
        offset: 20,
        limit: 10
      });
      done();
    });
  });

  it('should establish a wallet information on coin change', (done) => {
    const xrp = coinsMock.filter(v => v.key === 'xrp').shift();

    component.coinSelect$.subscribe((coin: ICoin) => {
      fixture.whenStable().then(() => {
        component.wallets$.subscribe((wallets: IWallet[]) => {
          fixture.whenStable().then(() => {
            const thisWallet = wallets.find((item) => item.cryptocurrency === coin.key);
            expect(thisWallet.balance.total).toEqual(0);
            done();
          });
        });
      });
    });

    component.selectPopular(xrp);
    fixture.detectChanges();
  });

  it('should change fee result on coin change if an amount is filled', (done) => {
    let prevFee = 0;
    let transactionFee = 0;
    const amountControl = component.withdrawForm.get('amount');

    const xrp = coinsMock.filter(v => v.key === 'xrp').shift();

    component.coinSelect$.pipe(take(1)).subscribe((coin: ICoin) => {
      fixture.whenStable().then(() => {

        component.transactionFee$.pipe(take(1)).subscribe((fee) => {
          fixture.whenStable().then(() => {
            prevFee = transactionFee;
            transactionFee = fee;

            expect(transactionFee).not.toEqual(prevFee);
            done();
          });
        });

      });
    });

    amountControl.setValue(100);
    component.selectPopular(xrp);
    fixture.detectChanges();
  });

  it('should change fee result on recipient address change if an amount is filled', (done) => {
    let prevFee = 0;
    let transactionFee = 0;
    const amountControl = component.withdrawForm.get('amount');

    component.addressSelect$.asObservable().pipe(take(1)).subscribe((address: IWalletAddress) => {
      fixture.whenStable().then(() => {
        component.transactionFee$.pipe(take(1)).subscribe((fee) => {
          fixture.whenStable().then(() => {
            prevFee = transactionFee;
            transactionFee = fee;

            expect(transactionFee).not.toEqual(prevFee);
            done();
          });
        });
      });
    });

    amountControl.setValue(100);
    component.addressSelect$.next(addressMock);
    fixture.detectChanges();
  });

  it('should change fee result on an amount number changes', (done) => {
    let prevFee = 0;
    let transactionFee = 0;
    const amountControl = component.withdrawForm.get('amount');


    amountControl.valueChanges.pipe(take(1)).subscribe((amount) => {
      fixture.whenStable().then(() => {
        component.transactionFee$.pipe(take(1)).subscribe((fee) => {
          fixture.whenStable().then(() => {
            prevFee = transactionFee;
            transactionFee = fee;

            expect(amount).toEqual(100);
            expect(transactionFee).not.toEqual(prevFee);
            done();
          });
        });
      });
    });

    amountControl.setValue(100);
    fixture.detectChanges();
  });

  it('should select popular and change fee result if an amount is filled', (done) => {
    let prevFee = 0;
    let transactionFee = 0;
    component.withdrawForm.get('amount').setValue(100);

    const xrp = coinsMock.filter(v => v.key === 'xrp').shift();

    component.coinSelect$.pipe(take(1)).subscribe((coin: ICoin) => {
      fixture.whenStable().then(() => {
        component.transactionFee$.pipe(take(1)).subscribe((fee) => {
          fixture.whenStable().then(() => {
            prevFee = transactionFee;
            transactionFee = fee;

            expect(transactionFee).not.toEqual(prevFee);
            done();
          });
        });
      });
    });

    component.selectPopular(xrp);
    fixture.detectChanges();
  });

  it('should not change fee result on coin and recipient address select if an amount is empty', (done) => {
    let prevFee = 0;
    let transactionFee = 0;
    component.withdrawForm.get('amount').setValue('');

    const xrp = coinsMock.filter(v => v.key === 'xrp').shift();

    fixture.whenStable().then(() => {
      fixture.ngZone.run(() => {
        component.transactionFee$.subscribe((fee) => {
          fixture.whenStable().then(() => {
            prevFee = transactionFee;
            transactionFee = fee;

            component.coinSelect$.pipe(skip(1)).subscribe((coin: ICoin) => {
              fixture.whenStable().then(() => {

                component.addressSelect$.asObservable().subscribe((address: IWalletAddress) => {
                  fixture.whenStable().then(() => {
                    expect(component.withdrawForm.invalid).toEqual(true);
                    expect(transactionFee).toEqual(prevFee);
                    done();
                  });
                });

                component.addressSelect$.next(addressMock);
                fixture.detectChanges();
              });
            });

            component.selectPopular(xrp);
            fixture.detectChanges();
          });
        });
      });
    });
  });

  it('should submit withdraw transaction on button Submit click', (done) => {
    const tag = '';
    const amountControl = component.withdrawForm.get('amount');
    amountControl.setValue(100);

    const xrp = coinsMock.filter(v => v.key === 'xrp').shift();

    component.coinSelect$.pipe(skip(1)).subscribe((coin: ICoin) => {
      fixture.whenStable().then(() => {

        component.addressSelect$.asObservable().subscribe((address: IWalletAddress) => {
          fixture.whenStable().then(() => {

            const withdrawObj = {
              coin: coin.key,
              address: address.address,
              amount: amountControl.value,
              tag,
            };

            expect(component.withdrawForm.invalid).toEqual(false);

            withdrawService.sendWithdraw(withdrawObj).subscribe((value) => {
              fixture.whenStable().then(() => {
                expect(value.status).toBe(200);
                done();
              });
            });
          });
        });

        component.addressSelect$.next(addressMock);
        fixture.detectChanges();
      });
    });

    component.selectPopular(xrp);
    fixture.detectChanges();
  });

});
