import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BaseComponent } from './components/base/base.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { WidgetComponent } from './components/widget/widget.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { TimeBeforePipe } from './pipes/time-before.pipe';
import { NotificationItemComponent } from './components/notification-item/notification-item.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MenuMobileComponent } from './components/menu-mobile/menu-mobile.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ToggleSecretTextPipe } from './pipes/toggle-secret-text.pipe';
import { PopoverModule } from './popover/popover.module';
import { CoinSelectComponent } from './components/coin-select/coin-select.component';
import { LayoutModule } from '@angular/cdk/layout';
import { CurrencySelectComponent } from './components/currency-select/currency-select.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { CurrencySelectedPipe } from './pipes/currency-selected.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { AddressSelectComponent } from './components/address-select/address-select.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { AddWithdrawAddressDialogComponent } from './components/add-withdraw-address-dialog/add-withdraw-address-dialog.component';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { ModalWindowComponent } from './components/modal-window/modal-window.component';
import { ResizableDirective } from './directives/resizable.directive';
import { SplitStringPipe } from './pipes/split-string.pipe';
import { CurrencyTypePipe } from './pipes/currency-type.pipe';

const components = [
  HeaderComponent,
  FooterComponent,
  BaseComponent,
  WidgetComponent,
  LanguageSwitcherComponent,
  NotificationItemComponent,
  PaginatorComponent,
  MenuMobileComponent,
  CoinSelectComponent,
  AddressSelectComponent,
  CurrencySelectComponent,
  ConfirmationComponent,
  AddWithdrawAddressDialogComponent,
  ModalWindowComponent,
];

const pipes = [
  TimeBeforePipe,
  ToggleSecretTextPipe,
  SafePipe,
  SplitStringPipe,
  CurrencySelectedPipe,
  CurrencyTypePipe,
];

@NgModule({
  declarations: [
    ...components,
    ...pipes,
    OnlyNumbersDirective,
    ResizableDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    AngularMaterialModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    ReactiveFormsModule,
    PopoverModule.forRoot(),
    LayoutModule,
    NgxEchartsModule.forRoot({
      /**
       * This will import all modules from echarts.
       * If you only need custom modules,
       * please refer to [Custom Build] section.
       */
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
    FormsModule,
  ],
  exports: [
    ...components,
    ...pipes,
    CommonModule,
    RouterModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    PopoverModule,
    LayoutModule,
    NgxEchartsModule,
    OnlyNumbersDirective,
    ResizableDirective,
  ],
  providers: [
    DatePipe
  ]
})
export class SharedModule {
}
