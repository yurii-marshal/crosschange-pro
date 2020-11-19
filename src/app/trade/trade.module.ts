import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersHistoryComponent } from 'src/app/trade/components/orders-history/orders-history.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/angular-material.module';

export const routes: Routes = [
  {
    path: '',
    component: OrdersHistoryComponent,
    children: []
  }
];

@NgModule({
  declarations: [
    OrdersHistoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ]
})
export class TradeModule { }
