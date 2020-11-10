import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeConfirmationComponent } from './exchange-confirmation.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { ExchangeService } from '../../../shared/services/exchange.service';
import { ExchangeServiceMock } from '../../../../../testing/ExchangeServiceMock';
import { of } from 'rxjs';
import { delay, share } from 'rxjs/operators';

describe('ExchangeConfirmationComponent', () => {
  let component: ExchangeConfirmationComponent;
  let fixture: ComponentFixture<ExchangeConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        MatIconModule
      ],
      declarations: [
        ExchangeConfirmationComponent
      ],
      providers: [
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        {
          provide: MAT_DIALOG_DATA, useValue: {
            confirmationStage: 1
          }
        },
        { provide: ExchangeService, useClass: ExchangeServiceMock },
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should confirm exchange', (done) => {
    const service = TestBed.inject(ExchangeService);
    spyOn(service, 'exchange').and.callFake(() => {
      const res = of(undefined).pipe(delay(500), share());
      res.pipe(delay(1000)).subscribe(() => {
        expect(component.confirmationStage).toEqual(3);
        done();
      });
      return res;
    });
    component.confirmExchange();
    expect(component.confirmationStage).toEqual(2);
  });

  it('should close dialog', () => {
    const spy = spyOn(component.dialogRef, 'close');
    component.closeDialog();
    expect(spy).toHaveBeenCalled();
  });

  it('should close dialog with result', () => {
    const spy = spyOn(component.dialogRef, 'close');
    component.closeDialog(true);
    expect(spy).toHaveBeenCalledWith(true);
  });
});
