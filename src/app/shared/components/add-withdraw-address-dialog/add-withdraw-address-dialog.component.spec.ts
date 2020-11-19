import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWithdrawAddressDialogComponent } from './add-withdraw-address-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { FakeMatIconRegistry, MatIconTestingModule } from '@angular/material/icon/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CoinServiceMock } from '../../../../../testing/CoinServiceMock';
import { ExchangeServiceMock } from '../../../../../testing/ExchangeServiceMock';

describe('AddWithdrawAddressDialogComponent', () => {
  let component: AddWithdrawAddressDialogComponent;
  let fixture: ComponentFixture<AddWithdrawAddressDialogComponent>;
  beforeEach(async () => {
    const popular = await new CoinServiceMock().getPopular().toPromise();
    const currencies = await new ExchangeServiceMock().getCurrencies().toPromise();
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatInputModule,
        MatIconTestingModule,
        MatIconModule,
        TranslateModule.forRoot(),
        MatSelectModule
      ],
      declarations: [ AddWithdrawAddressDialogComponent ],
      providers: [
        {provide: ENVIRONMENT, useValue: environment as IEnvironment},
        {
          provide: MatDialogRef, useValue: { close: () => {} }
        },
        {
          provide: MAT_DIALOG_DATA, useValue: {
            popular,
            currencies
          }
        },
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWithdrawAddressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
