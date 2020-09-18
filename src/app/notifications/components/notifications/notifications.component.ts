import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { Observable, Subject } from 'rxjs';
import { Notification } from '../../../core/interfaces/notification.interface';
import { NotificationCategory } from '../../../core/interfaces/notification-category.interface';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent implements OnInit, OnDestroy {
  categories: NotificationCategory[] = [];
  currentType = '';
  notifications$: Observable<Notification[]>;

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private notificationsService: NotificationsService,
  ) {
  }

  ngOnInit(): void {
    this.categories = this.notificationsService.notificationCategories;
    this.notifications$ = this.notificationsService.getNotifications();
  }

  setCategory(type: string): void {
    if (type !== this.currentType) {
      this.notifications$ =
        this.notificationsService.getNotifications(type ? {type} : null)
          .pipe(tap(() => {
            this.currentType = type;
          }));
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
