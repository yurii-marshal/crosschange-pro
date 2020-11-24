import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth-module/guards/auth/auth.guard';
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
import { TradeComponent } from './components/trade/trade.component';
import { TradeHeaderComponent } from './components/trade-header/trade-header.component';
import { ExchangeOrderComponent } from './components/exchange-order/exchange-order.component';
import { LinearSliderComponent } from './components/linear-slider/linear-slider.component';
import { MatSliderModule } from '@angular/material/slider';

export const routes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
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
    ExchangeOrderComponent,
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
