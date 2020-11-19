import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { IconService } from '../../../core/services/icon.service';
import { MatMenuModule } from '@angular/material/menu';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationItemComponent } from '../notification-item/notification-item.component';
import { PopoverGlobalTemplateComponent } from '../../popover/popover-global-template/popover-global-template.component';
import { PopoverFlexibleTemplateComponent } from '../../popover/popover-flexible-template/popover-flexible-template.component';
import { TimeBeforePipe } from '../../pipes/time-before.pipe';
import { PopoverAnchorDirective } from '../../popover/popover.directive';
import { defaultPopoverConfig, POPOVER_CONFIG_TOKEN } from '../../popover/popover-config';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        NotificationItemComponent,
        PopoverGlobalTemplateComponent,
        PopoverFlexibleTemplateComponent,
        TimeBeforePipe,
        PopoverAnchorDirective
      ],
      imports: [
        TranslateModule.forRoot(),
        MatIconModule,
        MatMenuModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        {provide: ENVIRONMENT, useValue: environment as IEnvironment},
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry },
        IconService,
        {
          provide: POPOVER_CONFIG_TOKEN,
          useValue: defaultPopoverConfig
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
