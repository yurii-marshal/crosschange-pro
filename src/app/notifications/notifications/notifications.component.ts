import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NotificationsService } from '../services/notifications.service';
import { Observable } from 'rxjs';
import { Notification } from '../../core/interfaces/notification.interface';
import { NotificationCategory } from '../../core/interfaces/notification-category.interface';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarNotificationComponent } from '../../shared/components/snackbar-notification/snackbar-notification.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent implements OnInit {
  categories: NotificationCategory[] = [];
  currentType = '';
  notifications$: Observable<Notification[]>;

  snackBarConfigs: MatSnackBarConfig = {
    panelClass: 'success',
    duration: 2 * 1000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  constructor(
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private notificationsService: NotificationsService,
  ) {
  }

  ngOnInit(): void {
    this.categories = this.notificationsService.notificationCategories;
    this.notifications$ = this.route.queryParams.pipe(
      switchMap(params => {
        this.currentType = params.type || '';
        return this.notificationsService.getNotifications(params.type ? params : null);
      })
    );
  }

  openSnackBarNotification(note: Notification): void {
    this.snackBar.openFromComponent(SnackbarNotificationComponent, {
      data: note,
      ...this.snackBarConfigs,
    });
  }
}

// _([
//   'notifications.all',
//   'notifications.system_messages',
//   'notifications.activities',
//   'notifications.news',
//   'notifications.trade',
// ]);
