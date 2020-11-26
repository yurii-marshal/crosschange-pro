import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ILayout, ITheme, IThemeOptions } from './theme-settings.interface';

@Injectable({
  providedIn: 'root'
})
export class ThemeSettingsService {
  themeOptions$: BehaviorSubject<IThemeOptions>;

  private readonly defaultOptions: IThemeOptions = {
    name: ITheme.Light,
    layout: ILayout.Classic,
  };

  private readonly LOCAL_STORAGE_KEY = 'themeOptions';

  constructor() {
    const savedOptions = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY));
    this.themeOptions$ = new BehaviorSubject(savedOptions ? savedOptions : this.defaultOptions);
  }

  setThemeOptions(options: IThemeOptions): void {
    this.themeOptions$.next(options);
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(options));
  }
}
