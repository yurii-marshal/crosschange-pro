import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationItemComponent } from './notification-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { TimeBeforePipe } from '../../pipes/time-before.pipe';

describe('NotificationItemComponent', () => {
  let component: NotificationItemComponent;
  let fixture: ComponentFixture<NotificationItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NotificationItemComponent,
        TimeBeforePipe,
      ],
      imports: [
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
