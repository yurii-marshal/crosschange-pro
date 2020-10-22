import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeConfirmationComponent } from './exchange-confirmation.component';

describe('ExchangeConfirmationComponent', () => {
  let component: ExchangeConfirmationComponent;
  let fixture: ComponentFixture<ExchangeConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeConfirmationComponent ]
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
});
