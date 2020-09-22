import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { IconService } from '../../../core/services/icon.service';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { MatMenuModule } from '@angular/material/menu';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let compiled: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FooterComponent,
        LanguageSwitcherComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        MatIconModule,
        MatMenuModule
      ],
      providers: [
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry },
        IconService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have copyright', () => {
    const copyright = compiled.querySelector('.copyright');
    expect(copyright.textContent).toEqual('footer.copyright');
  });
});
