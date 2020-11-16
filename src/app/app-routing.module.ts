import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './shared/components/base/base.component';
import { CanShowProGuard } from './core/guards/can-show-pro/can-show-pro.guard';
import { AuthGuard } from './auth-module/guards/auth/auth.guard';
import { JwtResolver } from 'shared-kuailian-lib';
export const routes: Routes = [
  {
    path: 'auth',
    resolve: { redirect: JwtResolver },
    children: [],
  },
  {
    path: '',
    component: BaseComponent,
    // TODO: ! GET CanShowProGuard BACK. !!! DELETED BECAUSE OF CANNOT ADD DEFAULT
    //  PRODUCT TO KUAILIAN BANK ON PROD BEFORE THIS PROJECTS IS LIVE. OLEG 21.10.2020
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'notifications',
        loadChildren: () => import('./notifications/notifications.module').then((m) => m.NotificationsModule),
      },
      {
        path: 'wallet',
        loadChildren: () => import('./wallet/wallet.module').then((m) => m.WalletModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule)
      },
      {
        path: 'exchange',
        loadChildren: () => import('./exchange/exchange.module').then((m) => m.ExchangeModule),
      },
      {
        path: 'company',
        loadChildren: () => import('./static-pages/static-pages.module').then((m) => m.StaticPagesModule),
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/error/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
