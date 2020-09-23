import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BaseComponent } from './components/base/base.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { MatMenuModule } from '@angular/material/menu';
import { MenuMobileComponent } from './components/menu-mobile/menu-mobile.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    BaseComponent,
    LanguageSwitcherComponent,
    MenuMobileComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
  ],
  exports: [
    BaseComponent,
    FooterComponent,
    HeaderComponent,
    CommonModule,
    RouterModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ]
})
export class SharedModule { }
