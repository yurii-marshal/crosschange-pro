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
import { SnackbarNotificationComponent } from './components/snackbar-notification/snackbar-notification.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { MatMenuModule } from '@angular/material/menu';
import { MenuMobileComponent } from './components/menu-mobile/menu-mobile.component';
import { MatSidenavModule } from '@angular/material/sidenav';

const components = [
  HeaderComponent,
  FooterComponent,
  BaseComponent,
  WidgetComponent,
  LanguageSwitcherComponent,
  NotificationItemComponent,
  PaginatorComponent,
  SnackbarNotificationComponent,
  MenuMobileComponent,

  TimeBeforePipe,
];

@NgModule({
  declarations: [
    ...components,
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
  ],
  exports: [
    ...components,
    CommonModule,
    RouterModule,
    TranslateModule,
  ],
  providers: [DatePipe]
})
export class SharedModule { }
