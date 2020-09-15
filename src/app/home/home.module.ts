import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { MarketsComponent } from './components/markets/markets.component';
import { AngularMaterialModule } from "src/app/angular-material.module";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [],
    data: {
      headerClass: 'transparent'
    }
  }, {
    path: 'markets',
    component: MarketsComponent,
    children: [],
  }
];

@NgModule({
  declarations: [
    HomeComponent,
    MarketsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AngularMaterialModule,
  ]
})
export class HomeModule { }
