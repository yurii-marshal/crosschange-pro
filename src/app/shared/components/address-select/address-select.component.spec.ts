import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressSelectComponent } from './address-select.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { FakeMatIconRegistry, MatIconTestingModule } from '@angular/material/icon/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

describe('AddressSelectComponent', () => {
  let component: AddressSelectComponent;
  let fixture: ComponentFixture<AddressSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatIconTestingModule,
        MatIconModule,
      ],
      providers: [
        {provide: ENVIRONMENT, useValue: environment as IEnvironment},
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry },
      ],
      declarations: [ AddressSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
