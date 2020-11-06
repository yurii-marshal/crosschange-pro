import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { AuthGuard } from '../auth-module/guards/auth/auth.guard';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { SelectedWalletBalancePipe } from './pipes/selected-wallet-balance.pipe';
import { SelectedWalletKeyPipe } from './pipes/selected-wallet-key.pipe';
import { ExchangeConfirmationComponent } from './components/exchange-confirmation/exchange-confirmation.component';

export const routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [ AuthGuard ],
  }
];

@NgModule({
  declarations: [MainComponent, SelectedWalletBalancePipe, SelectedWalletKeyPipe, ExchangeConfirmationComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    AngularMaterialModule,
  ]
})
export class BuyCryptoModule { }
