import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ILayout, ITheme } from './theme-settings.interface';

@Injectable({
  providedIn: 'root'
})
export class ThemeSettingsService {
  currentTheme$: BehaviorSubject<ITheme> = new BehaviorSubject<ITheme>(ITheme.Light);
  currentLayout$: BehaviorSubject<ILayout> = new BehaviorSubject<ILayout>(ILayout.Classic);

  constructor() {
  }
}
