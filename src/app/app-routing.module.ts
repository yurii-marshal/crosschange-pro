import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './shared/components/base/base.component';
import { CanShowProGuard } from './core/guards/can-show-pro/can-show-pro.guard';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    canActivate: [CanShowProGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
