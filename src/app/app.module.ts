import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import {
  ENVIRONMENT,
  IEnvironment,
  AcceptLanguageInterceptor,
  AppMissingTranslationHandler,
  AssetsAuthInterceptor,
  HttpErrorsInterceptor,
  HttpLoaderFactory,
  I18nSharedService,
  SharedKuailianLibModule,
  JwtInterceptor
} from 'shared-kuailian-lib';
import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';


const heroServiceFactory = (translateService: TranslateService): I18nSharedService => {
  return new I18nSharedService(translateService);
};


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: AppMissingTranslationHandler
      }
    }),
    SharedKuailianLibModule,
    SharedModule
  ],
  providers: [
    {
      provide: ENVIRONMENT,
      useValue: environment as IEnvironment
    },
    {
      provide: 'HTTP_INTERCEPTORS',
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: 'HTTP_INTERCEPTORS',
      useClass: HttpErrorsInterceptor,
      multi: true
    },
    {
      provide: 'HTTP_INTERCEPTORS',
      useClass: AssetsAuthInterceptor,
      multi: true
    }, {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {duration: 2.5 * 1000, verticalPosition: 'top'}
    },
    {
      provide: 'HTTP_INTERCEPTORS',
      useClass: AcceptLanguageInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
