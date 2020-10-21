import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { MarketsComponent } from './components/markets/markets.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { JwtResolver } from 'shared-kuailian-lib';
import { AuthGuard } from '../auth-module/guards/auth/auth.guard';
import { ReactiveFormsModule } from '@angular/forms';

export const routes: Routes = [
  {
    path: 'auth',
    resolve: { redirect: JwtResolver },
    children: [],
  },
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
];

@NgModule({
  declarations: [
    HomeComponent,
    MarketsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ]
})
export class HomeModule { }
