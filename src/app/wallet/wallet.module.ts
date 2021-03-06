import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../auth-module/guards/auth/auth.guard';
import { WalletComponent } from './components/wallet/wallet.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { MainComponent } from './components/main/main.component';
import { DepositComponent } from './components/deposit/deposit.component';
import { ClipboardModule } from 'ngx-clipboard';
import { SelectedWalletPipe } from './pipes/selected-wallet.pipe';
import { QrCodeComponent } from './components/qr-code/qr-code.component';
import { WithdrawComponent } from './components/withdraw/withdraw.component';

export const routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [ AuthGuard ],
    children: [
      {
        path: 'balance',
        component: WalletComponent,
      },
      {
        path: 'deposit',
        component: DepositComponent,
      },
      {
        path: 'withdraw',
        component: WithdrawComponent,
      },
    ],
  }
];

@NgModule({
  declarations: [
    WalletComponent,
    MainComponent,
    DepositComponent,
    SelectedWalletPipe,
    QrCodeComponent,
    WithdrawComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    AngularMaterialModule,
    ClipboardModule,
  ]
})
export class WalletModule { }
