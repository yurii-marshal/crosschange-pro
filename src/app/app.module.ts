import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  AppMissingTranslationHandler,
  AssetsAuthInterceptor,
  ENVIRONMENT,
  HttpErrorsInterceptor,
  HttpLoaderFactory,
  I18nSharedService,
  IEnvironment,
  JwtInterceptor
} from 'shared-kuailian-lib';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';


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
  ],
  providers: [
    I18nSharedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
