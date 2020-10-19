import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { AuthGuard } from '../auth-module/guards/auth/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SelectedWalletBalancePipe } from './pipes/selected-wallet-balance.pipe';
import { SelectedWalletKeyPipe } from './pipes/selected-wallet-key.pipe';

export const routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [ AuthGuard ],
  }
];


@NgModule({
  declarations: [MainComponent, SelectedWalletBalancePipe, SelectedWalletKeyPipe],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatButtonToggleModule
  ],
})
export class ExchangeModule { }
