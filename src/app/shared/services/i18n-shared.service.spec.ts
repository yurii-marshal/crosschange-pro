import { TestBed } from '@angular/core/testing';

import { I18nSharedService } from './i18n-shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StorageKeys } from 'shared-kuailian-lib';
describe('I18nSharedService', () => {
  let service: I18nSharedService;
  let translateService: TranslateService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ]
    });
    translateService = TestBed.inject(TranslateService);
    service = TestBed.inject(I18nSharedService);

    let store = {};

    spyOn(localStorage, 'getItem').and.callFake( (key: string): string => {
      return store[key] || null;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string): void =>  {
      delete store[key];
    });
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string =>  {
      return store[key] = (value as string);
    });
    spyOn(localStorage, 'clear').and.callFake(() =>  {
      store = {};
    });

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set default language equal to browser language', () => {
    spyOn(translateService, 'getBrowserLang').and.returnValue('es');
    service.i18nBootstrap(['en', 'es'], 'en');
    expect(translateService.currentLang).toEqual('es');
  });

  it('should set default language equal to local storage set language', () => {
    spyOn(translateService, 'getBrowserLang').and.returnValue('es');
    localStorage.setItem(StorageKeys.InterfaceLanguage, 'en');
    service.i18nBootstrap(['en', 'es'], 'es');
    expect(translateService.currentLang).toEqual('en');
  });

  it('should set default language', () => {
    spyOn(translateService, 'getBrowserLang').and.returnValue('es');
    localStorage.setItem(StorageKeys.InterfaceLanguage, 'ru');
    service.i18nBootstrap(['uk'], 'uk');
    expect(translateService.currentLang).toEqual('uk');
  });
});
