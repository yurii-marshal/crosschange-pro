import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { IconService } from '../../../core/services/icon.service';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { MainTestHelper } from '../../../../../testing/MainTestHelper';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../../../../environments/environment';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { I18nTestHelper } from '../../../../../testing/I18nTestHelper';
const i18nHelper = new I18nTestHelper();

describe('LanguageSwitcherComponent', () => {
  let component:
    LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let compiled: HTMLElement;
  let translateService: TranslateService;
  let loader: HarnessLoader;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LanguageSwitcherComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        MatMenuModule,
        MatIconModule
      ],
      providers: [
        IconService,
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    translateService = TestBed.inject(TranslateService);
    i18nHelper.initService(translateService);
    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the switcher', () => {
    expect(compiled.querySelector('.switcher')).toBeTruthy();
  });

  it('should have english as default', async () => {
    const switcher: HTMLElement = compiled.querySelector('.language');
    const val = await translateService.get('languages.en').toPromise();
    expect(switcher.textContent).toEqual(val);
  });

  it('should open dropdown menu', async () => {
    const switcher: HTMLElement = compiled.querySelector('.switcher');
    MainTestHelper.click(switcher);
    fixture.detectChanges();
    await fixture.whenStable();
    const menu = compiled.querySelector('mat-menu');
    expect(menu).toBeTruthy();
  });

  /**
   * IMPORTANT about testing with material components involved:
   * https://material.angular.io/guide/using-component-harnesses - from Angular material v10 Docs
   */
  it('should have proper languages length in dropdown menu', async () => {
    const menu = await loader.getHarness(MatMenuHarness);
    await menu.open();
    const items = await menu.getItems();
    expect(items.length).toEqual(environment.locales.length);
  });

  it('should change language', async () => {
    const menu = await loader.getHarness(MatMenuHarness);
    await menu.open();
    let key = await translateService.get('languages.ru').toPromise();
    await menu.clickItem({text: key});
    key = await translateService.get('languages.ru').toPromise();
    const language: HTMLElement = compiled.querySelector('.language');
    expect(language.textContent).toEqual(key);
    expect(component.currentLang).toEqual('ru');
  });

  it('should set language', async () => {
    component.language = 'ru';
    expect(component.currentLang).toEqual('ru');
  });

  it('should have list of supported languages', async () => {
    expect(component.supportedLanguages).toEqual(environment.locales);
  });


  it('should change icon on menu open', async () => {
    const icon: HTMLElement = compiled.querySelector('.switcher > mat-icon');
    expect(icon.textContent).toEqual('arrow_drop_down');
    const menu = await loader.getHarness(MatMenuHarness);
    await menu.open();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(icon.textContent).toEqual('arrow_drop_up');
  });

});
