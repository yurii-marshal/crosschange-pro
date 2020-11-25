import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IThemes } from './theme-settings.interface';

@Injectable({
  providedIn: 'root'
})
export class ThemeSettingsService {
  currentTheme$: BehaviorSubject<IThemes> = new BehaviorSubject<IThemes>(IThemes.Light);

  constructor() { }
}
