import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsComponent } from './notifications.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { defaultPopoverConfig, POPOVER_CONFIG_TOKEN } from '../../shared/popover/popover-config';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../../../testing/ActivatedRouteStub';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationItemComponent } from '../../shared/components/notification-item/notification-item.component';
import { TimeBeforePipe } from '../../shared/pipes/time-before.pipe';
import { RouterTestingModule } from '@angular/router/testing';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let routeStub: ActivatedRouteStub;
  beforeEach(async(() => {
    routeStub = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      imports: [
        OverlayModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [
        NotificationsComponent,
        NotificationItemComponent,
        TimeBeforePipe
      ],
      providers: [
        {
          provide: POPOVER_CONFIG_TOKEN,
          useValue: defaultPopoverConfig
        },
        { provide: ActivatedRoute, useValue: routeStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
