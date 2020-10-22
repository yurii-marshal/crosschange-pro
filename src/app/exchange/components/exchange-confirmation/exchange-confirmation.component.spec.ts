import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeConfirmationComponent } from './exchange-confirmation.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {FakeMatIconRegistry} from '@angular/material/icon/testing';

fdescribe('ExchangeConfirmationComponent', () => {
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
        { provide: MAT_DIALOG_DATA, useValue: {
            confirmationStage: 1
          } }
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

  it('should confirm exchange', () => {
    component.confirmExchange();
    expect(component.confirmationStage).toEqual(2);
  });

  it('should close dialog', () => {
    const spy = spyOn(component.dialogRef, 'close');
    component.closeDialog();
    expect(spy).toHaveBeenCalled();
  });

  // TODO: ADD TESTS AFTER FURTHER COMPONENT IMPLEMENTATION
});
