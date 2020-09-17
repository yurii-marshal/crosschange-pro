import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { Observable, Subject } from 'rxjs';
import { Notification } from '../../../core/interfaces/notification.interface';
import { NotificationCategory } from '../../../core/interfaces/notification-category.interface';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent implements OnInit, OnDestroy {
  categories: NotificationCategory[] = [];
  currentType: string;
  notifications$: Observable<Notification[]>;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private notificationsService: NotificationsService,
  ) {
  }

  ngOnInit(): void {
    this.notifications$ = this.notificationsService.getNotifications();
  }

  setCategory(type: string): void {
    this.currentType = type;
    this.notifications$ = this.notificationsService.getNotifications({type});
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
