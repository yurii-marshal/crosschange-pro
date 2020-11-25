import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TradeComponent } from './components/trade/trade.component';
import { TradeHeaderComponent } from './components/trade-header/trade-header.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

export const routes: Routes = [
  {
    path: '',
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
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    DragDropModule,
  ]
})
export class TradeModule {
}
