import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Notification } from '../../core/interfaces/notification.interface';
import { NotificationCategory } from '../../core/interfaces/notification-category.interface';
import { map } from 'rxjs/operators';
import { INotificationService, INotification, ApiService } from 'shared-kuailian-lib';
@Injectable({
  providedIn: 'root'
})
export class NotificationsService implements INotificationService {

  notifications: Notification[] = [
    {
      header: 'Just in all. Платформа XXX запущена на ПК. To provide you with the best margin trading experience',
      message: 'To provide you with the best margin trading experience, we are inviting you to participate in our Margin Trading Survey. It will only take you five minutes, and we will reward the first 1,000 participants with 2 BUSD each. Another 1,000 participants will be randomly selected to receive 2 BUSD as well. We will deposit your reward directly into your margin account.',
      date: new Date(1600434582035),
      category: '',
      isNew: true,
    },
    {
      header: 'Just at all. Платформа XXX запущена на ПК. To provide you with the best margin trading experience',
      message: 'To provide you with the best margin trading experience, we are inviting you to participate in our Margin Trading Survey. It will only take you five minutes, and we will reward the first 1,000 participants with 2 BUSD each. Another 1,000 participants will be randomly selected to receive 2 BUSD as well. We will deposit your reward directly into your margin account.',
      date: new Date(),
      category: '',
      isNew: true,
    },
    {
      header: 'System msg. Платформа XXX запущена на ПК',
      message: 'To provide you with the best margin trading experience, we are inviting you to participate in our Margin Trading Survey. It will only take you five minutes, and we will reward the first 1,000 participants with 2 BUSD each. Another 1,000 participants will be randomly selected to receive 2 BUSD as well. We will deposit your reward directly into your margin account.',
      date: new Date(),
      category: 'system_messages',
      isNew: true,
    },
    {
      header: 'Activities. Платформа XXX запущена на ПК',
      message: 'To provide you with the best margin trading experience, we are inviting you to participate in our Margin Trading Survey. It will only take you five minutes, and we will reward the first 1,000 participants with 2 BUSD each. Another 1,000 participants will be randomly selected to receive 2 BUSD as well. We will deposit your reward directly into your margin account.',
      date: new Date(),
      category: 'activities',
      isNew: true,
    },
    {
      header: 'News. Платформа XXX запущена на ПК',
      message: 'To provide you with the best margin trading experience, we are inviting you to participate in our Margin Trading Survey. It will only take you five minutes, and we will reward the first 1,000 participants with 2 BUSD each. Another 1,000 participants will be randomly selected to receive 2 BUSD as well. We will deposit your reward directly into your margin account.',
      date: new Date(),
      category: 'news',
      isNew: false,
    },
    {
      header: 'Trade mess. Платформа XXX запущена на ПК',
      message: 'To provide you with the best margin trading experience, we are inviting you to participate in our Margin Trading Survey. It will only take you five minutes, and we will reward the first 1,000 participants with 2 BUSD each. Another 1,000 participants will be randomly selected to receive 2 BUSD as well. We will deposit your reward directly into your margin account.',
      date: new Date(),
      category: 'trade',
      isNew: false,
    },
  ];

  newNotification = new Subject<INotification>();
  unreadNotificationCountChanged = new Subject<number>();
  unreadNotificationsCount = 0;
  constructor() {}

  get notificationCategories(): NotificationCategory[] {
    return [
      {
        label: 'All',
        value: '',
      },
      {
        label: 'System messages',
        value: 'system_messages',
      },
      {
        label: 'Activities',
        value: 'activities',
      },
      {
        label: 'Kuailian news',
        value: 'news',
      },
      {
        label: 'Trade notifications',
        value: 'trade',
      },
    ];
  }

  getNotifications(params?): Observable<Notification[]> {
    return of({}).pipe(
      map(() => {
        if (params) {
          if (params.type) {
            return this.notifications.filter(item => item.category === params.type);
          }

          if (params.isNew) {
            return this.notifications.filter(item => item.isNew === params.isNew);
          }
        }

        return this.notifications;
      })
    );
  }

  emitNewNotification(notification: INotification): void {
    // TODO: implement
  }

}
