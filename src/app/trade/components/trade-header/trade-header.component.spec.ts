import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeHeaderComponent } from './trade-header.component';

describe('TradeHeaderComponent', () => {
  let component: TradeHeaderComponent;
  let fixture: ComponentFixture<TradeHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
