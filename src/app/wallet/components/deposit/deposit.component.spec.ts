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
import { CoinServiceMock } from '../../../../../testing/CoinServiceMock';
import { ActivatedRouteStub } from '../../../../../testing/ActivatedRouteStub';
import { ActivatedRoute } from '@angular/router';
import {MainComponent} from '../main/main.component';

fdescribe('DepositComponent', () => {
  let component: DepositComponent;
  let fixture: ComponentFixture<DepositComponent>;
  let routeStub: ActivatedRouteStub;

  beforeEach(async(() => {
    routeStub = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: 'wallet',
            component: MainComponent,
            children: [
              {
                path: 'deposit',
                component: DepositComponent
              }
            ]
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
      ]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositComponent);
    routeStub.setQueryParamMap({offset: 0, limit: 10});
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*it('should load deposit history', (done) => {
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
  });*/

});
