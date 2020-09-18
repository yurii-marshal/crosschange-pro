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

const components = [
  HeaderComponent,
  FooterComponent,
  BaseComponent,
  WidgetComponent,

  TimeBeforePipe,
];

@NgModule({
  declarations: [
    ...components,
    LanguageSwitcherComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    AngularMaterialModule,
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
