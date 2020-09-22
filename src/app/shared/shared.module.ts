import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BaseComponent } from './components/base/base.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { WidgetComponent } from './components/widget/widget.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { PaginatorComponent } from './components/paginator/paginator.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    BaseComponent,
    LanguageSwitcherComponent,
    WidgetComponent,
    PaginatorComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    AngularMaterialModule,
  ],
  exports: [
    BaseComponent,
    FooterComponent,
    HeaderComponent,
    CommonModule,
    RouterModule,
    TranslateModule,
    WidgetComponent,
    PaginatorComponent
  ]
})
export class SharedModule { }
