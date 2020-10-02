import { environment } from '../src/environments/environment';
export class I18nTestHelper {
  translations = {};
  constructor() {
    environment.locales.forEach(lang => {
      this.translations[lang] = require(`src/assets/i18n/en.json`);
    });
  }

  public initService(translateService): void {
    for (const key in this.translations) {
      if (!this.translations.hasOwnProperty(key)) {
        continue;
      }
      translateService.setTranslation(key, this.translations[key]);
    }
    translateService.setDefaultLang('en');
    translateService.use('en');
  }
}
