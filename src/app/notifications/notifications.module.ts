import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsComponent } from './notifications/notifications.component';
import { SharedModule } from '../shared/shared.module';
import { AngularMaterialModule } from '../angular-material.module';

export const routes: Routes = [
  {
    path: '',
    component: NotificationsComponent,
    data: {
      footerClass: 'hide'
    },
    children: [],
  }
];

@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AngularMaterialModule,
  ]
})
export class NotificationsModule { }
