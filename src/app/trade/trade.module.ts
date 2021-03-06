import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TradeComponent } from './components/trade/trade.component';
import { TradeHeaderComponent } from './components/trade-header/trade-header.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OrdersHistoryContainerComponent } from 'src/app/trade/components/orders-history/orders-history-container/orders-history-container.component';
import { OrderHistoryComponent } from './components/orders-history/order-history/order-history.component';
import { OpenOrdersComponent } from './components/orders-history/open-orders/open-orders.component';
import { TradeHistoryComponent } from './components/orders-history/trade-history/trade-history.component';
import { FoundsComponent } from './components/orders-history/founds/founds.component';
import { PeriodPickerComponent } from './components/orders-history/period-picker/period-picker.component';
import { PlaceOrderComponent } from './components/place-order/place-order.component';
import { LinearSliderComponent } from './components/linear-slider/linear-slider.component';
import { MatSliderModule } from '@angular/material/slider';

export const routes: Routes = [
  {
    path: ':pair',
    component: TradeComponent,
    children: [],
    data: {
      headerClass: 'widget'
    },
  },
];

@NgModule({
  declarations: [
    TradeComponent,
    TradeHeaderComponent,
    OrdersHistoryContainerComponent,
    OrderHistoryComponent,
    OpenOrdersComponent,
    TradeHistoryComponent,
    FoundsComponent,
    PeriodPickerComponent,
    PlaceOrderComponent,
    LinearSliderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    DragDropModule,
    MatSliderModule,
  ]
})
export class TradeModule {
}
