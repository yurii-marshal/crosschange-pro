import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencySelectComponent } from './currency-select.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { environment } from '../../../../environments/environment';

fdescribe('CurrencySelectComponent', () => {
  let component: CurrencySelectComponent;
  let fixture: ComponentFixture<CurrencySelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencySelectComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [
        {
          provide: ENVIRONMENT,
          useValue: environment as IEnvironment
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
