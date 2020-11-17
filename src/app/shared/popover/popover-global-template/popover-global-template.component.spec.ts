import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverGlobalTemplateComponent } from './popover-global-template.component';
import { TranslateModule } from '@ngx-translate/core';
import { defaultPopoverConfig, POPOVER_CONFIG_TOKEN, PopoverData } from '../popover-config';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PopoverRef } from '../popover-ref';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FakeMatIconRegistry, MatIconTestingModule } from '@angular/material/icon/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

describe('PopoverComponent', () => {
  let component: PopoverGlobalTemplateComponent;
  let fixture: ComponentFixture<PopoverGlobalTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatIconTestingModule,
        MatIconModule,

      ],
      declarations: [ PopoverGlobalTemplateComponent ],
      providers: [
        { provide: PopoverData, useValue: {} },
        { provide: PopoverRef, useValue: {} },
        {
          provide: POPOVER_CONFIG_TOKEN,
          useValue: defaultPopoverConfig
        },
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverGlobalTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
