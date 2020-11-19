import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMobileComponent } from './menu-mobile.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry, MatIconTestingModule } from '@angular/material/icon/testing';

describe('MenuMobileComponent', () => {
  let component: MenuMobileComponent;
  let fixture: ComponentFixture<MenuMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        MatIconModule,
        MatIconTestingModule,

      ],
      declarations: [
        MenuMobileComponent
      ],
      providers: [
        {provide: ENVIRONMENT, useValue: environment as IEnvironment},
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
