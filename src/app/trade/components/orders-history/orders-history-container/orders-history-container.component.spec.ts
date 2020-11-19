import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersHistoryContainerComponent } from 'src/app/trade/components/orders-history/orders-history-container/orders-history-container.component';

describe('OrdersHistoryContainerComponent', () => {
  let component: OrdersHistoryContainerComponent;
  let fixture: ComponentFixture<OrdersHistoryContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersHistoryContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersHistoryContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
