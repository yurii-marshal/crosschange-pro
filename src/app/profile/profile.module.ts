import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressManagementComponent } from './components/address-management/address-management.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth-module/guards/auth/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { AngularMaterialModule } from '../angular-material.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

export const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [ AuthGuard ],
    children: [
      {
        path: 'security',
        children: [
          {
            path: 'address',
            component: AddressManagementComponent,
          }
        ]
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddressManagementComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class ProfileModule { }
