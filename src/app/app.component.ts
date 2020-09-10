import { AfterViewInit, Component } from '@angular/core';
import { environment } from '../environments/environment';
import {
  StorageKeys
} from 'shared-kuailian-lib';
import { TranslateService } from '@ngx-translate/core';
import { I18nSharedService } from './shared/services/i18n-shared.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  constructor(
              private i18nService: I18nSharedService,
              private translateService: TranslateService
  ) {
    const {locales, defaultLocale} = environment;
    this.i18nService.i18nBootstrap(locales, defaultLocale);
  }

  ngAfterViewInit(): void {
    this.translateService.onLangChange.subscribe((lang) => {
      localStorage.setItem(StorageKeys.InterfaceLanguage, lang.lang);
    });
  }
}
