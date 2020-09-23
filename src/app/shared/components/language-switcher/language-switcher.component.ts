import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSwitcherComponent implements OnInit {
  opened = false;

  constructor(private translateService: TranslateService) {
  }

  get currentLang(): string {
    return this.translateService.currentLang;
  }

  get supportedLanguages(): string[] {
    return this.translateService.getLangs();
  }

  set language(value: string) {
    this.translateService.use(value);
  }

  ngOnInit(): void {
  }

}

_([
  'languages.chi',
  'languages.en',
  'languages.ru',
  'languages.uk',
  'languages.de',
  'languages.fr',
  'languages.es',
  'languages.chi_mobile',
  'languages.en_mobile',
  'languages.ru_mobile',
  'languages.uk_mobile',
  'languages.de_mobile',
  'languages.fr_mobile',
  'languages.es_mobile',
]);
