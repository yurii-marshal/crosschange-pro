import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './shared/components/base/base.component';
import { MeResolverService } from './core/services/me-resolver/me-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    resolve: {
      me: MeResolverService
    },
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
