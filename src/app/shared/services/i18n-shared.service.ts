import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageKeys } from 'shared-kuailian-lib';

@Injectable({
  providedIn: 'root'
})
export class I18nSharedService {

  constructor(private translateService: TranslateService) {}

  i18nBootstrap(locales, defaultLocale): void {
    const browserLocale = this.translateService.getBrowserLang();
    const userLocale = localStorage.getItem(StorageKeys.InterfaceLanguage);

    let useLang = defaultLocale;
    if (userLocale && locales.includes(userLocale)) {
      useLang = userLocale;
    } else if (browserLocale && locales.includes(browserLocale)) {
      useLang = browserLocale;
    }

    this.translateService.addLangs(locales);
    this.translateService.use(useLang);
  }
}
