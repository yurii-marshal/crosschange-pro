import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { MarketsComponent } from './components/markets/markets.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { JwtResolver } from 'shared-kuailian-lib';
import { AuthGuard } from '../auth-module/guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    resolve: { redirect: JwtResolver },
    children: []
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [ AuthGuard ],
    children: [],
    data: {
      headerClass: 'transparent'
    }
  },
  {
    path: 'markets',
    canActivate: [ AuthGuard ],
    component: MarketsComponent,
    children: [],
    data: {
      headerClass: 'transparent'
    }
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
