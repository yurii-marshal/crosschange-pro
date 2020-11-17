import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletComponent } from './wallet.component';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../../../../testing/ActivatedRouteStub';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { TranslateModule } from '@ngx-translate/core';
import { ToggleSecretTextPipe } from '../../../shared/pipes/toggle-secret-text.pipe';
import { MatTableModule } from '@angular/material/table';
import { FakeMatIconRegistry, MatIconTestingModule } from '@angular/material/icon/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('WalletComponent', () => {
  let component: WalletComponent;
  let fixture: ComponentFixture<WalletComponent>;
  let routeStub: ActivatedRouteStub;
  beforeEach(async(() => {
    routeStub = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MatTableModule,
        MatIconTestingModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        PaginatorComponent,
        WalletComponent,
        ToggleSecretTextPipe
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
    fixture = TestBed.createComponent(WalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
