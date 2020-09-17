import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsComponent } from './components/notifications/notifications.component';

export const routes: Routes = [
  {
    path: '',
    component: NotificationsComponent,
    data: {
      headerClass: 'transparent'
    },
  }
];

@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class NotificationsModule { }
