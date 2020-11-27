import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationComponent } from './confirmation.component';
import { environment } from '../../../../environments/environment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry, MatIconTestingModule } from '@angular/material/icon/testing';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        MatIconModule,
        MatIconTestingModule
      ],
      declarations: [ ConfirmationComponent ],
      providers: [
        {provide: ENVIRONMENT, useValue: environment as IEnvironment},
        {
          provide: MatDialogRef, useValue: { close: () => {} }
        },
        {
          provide: MAT_DIALOG_DATA, useValue: {
            label: 'profile_page.sure_turn_off_whitelist',
            text: 'profile_page.after_turning_off',
            buttonText: 'profile_page.turn_off',
            buttonColor: 'color-brand',
            icon: 'whitelist'
          }
        },
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
