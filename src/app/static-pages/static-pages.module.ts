import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { AuthGuard } from '../auth-module/guards/auth/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { CommissionsComponent } from './components/commissions/commissions.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [ AuthGuard ],
    children: [
      {
        path: 'commissions',
        component: CommissionsComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    MainComponent,
    CommissionsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class StaticPagesModule { }
