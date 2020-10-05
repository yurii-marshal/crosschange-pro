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

fdescribe('DepositComponent', () => {
  let component: DepositComponent;
  let fixture: ComponentFixture<DepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: 'wallet',
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
        SelectedWalletPipe
      ],
      providers: [
        {
          provide: ENVIRONMENT,
          useValue: environment as IEnvironment
        },
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry }
      ]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
