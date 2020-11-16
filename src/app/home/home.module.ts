import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { MarketsComponent } from './components/markets/markets.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';

import { AuthGuard } from '../auth-module/guards/auth/auth.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { TradeComponent } from './components/trade/trade.component';
import { PairsGuard } from './guards/pairs-guard/pairs.guard';
import { DragDropModule } from '@angular/cdk/drag-drop';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [ AuthGuard ],
    data: {
      headerClass: 'transparent'
    },
    children: [],
  },
  {
    path: 'markets',
    canActivate: [ AuthGuard ],
    component: MarketsComponent,
    children: [],
    data: {
      headerClass: 'widget'
    },
  },
  {
    path: 'trade/:pair',
    // todo: uncomment when pairs endpoint is 200
    // canActivate: [ AuthGuard, PairsGuard ],
    component: TradeComponent,
    children: [],
    data: {
      headerClass: 'widget'
    },
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    MarketsComponent,
    TradeComponent,
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
export class HomeModule { }
