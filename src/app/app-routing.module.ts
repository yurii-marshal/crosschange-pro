import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './shared/components/base/base.component';
import { CanShowProGuard } from './core/guards/can-show-pro/can-show-pro.guard';
import { ConnectWebsocketResolver } from './shared/resolvers/connect-websocket.resolver';

export const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    canActivate: [CanShowProGuard],
    resolve: {
      user: ConnectWebsocketResolver
    },
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
    ]
  },
  {
    path: '**',
    redirectTo: '/error/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
