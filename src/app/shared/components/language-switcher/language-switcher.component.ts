import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnInit {
  opened = false;
  get currentLang(): string {
    return this.translateService.currentLang;
  }

  get supportedLanguages(): string[] {
    return this.translateService.getLangs();
  }

  set language(value: string) {
    this.translateService.use(value);
  }

  constructor(private translateService: TranslateService) {
  }

  ngOnInit(): void {
  }


}
