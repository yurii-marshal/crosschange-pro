import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressManagementComponent } from './address-management.component';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ActivatedRouteStub } from '../../../../../testing/ActivatedRouteStub';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { FakeMatIconRegistry, MatIconTestingModule } from '@angular/material/icon/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';

describe('AddressManagementComponent', () => {
  let component: AddressManagementComponent;
  let fixture: ComponentFixture<AddressManagementComponent>;
  let routeStub: ActivatedRouteStub;
  beforeEach(async(() => {
    routeStub = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        TranslateModule.forRoot(),
        MatTableModule,
        MatIconTestingModule,
        MatIconModule,
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        AddressManagementComponent,
        PaginatorComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        {provide: ENVIRONMENT, useValue: environment as IEnvironment},
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
