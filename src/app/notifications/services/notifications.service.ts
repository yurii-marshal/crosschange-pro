import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Notification } from '../../core/interfaces/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  notifications: Notification[] = [
    {
      header: 'Платформа XXX запущена на ПК. To provide you with the best margin trading experience',
      message: 'To provide you with the best margin trading experience, we are inviting you to participate in our Margin Trading Survey. It will only take you five minutes, and we will reward the first 1,000 participants with 2 BUSD each. Another 1,000 participants will be randomly selected to receive 2 BUSD as well. We will deposit your reward directly into your margin account.',
      date: new Date(),
      active: true,
    },
    {
      header: 'Платформа XXX запущена на ПК',
      message: 'To provide you with the best margin trading experience, we are inviting you to participate in our Margin Trading Survey. It will only take you five minutes, and we will reward the first 1,000 participants with 2 BUSD each. Another 1,000 participants will be randomly selected to receive 2 BUSD as well. We will deposit your reward directly into your margin account.',
      date: new Date(),
      category: '',
      active: true,
    },
    {
      header: 'Платформа XXX запущена на ПК',
      message: 'To provide you with the best margin trading experience, we are inviting you to participate in our Margin Trading Survey. It will only take you five minutes, and we will reward the first 1,000 participants with 2 BUSD each. Another 1,000 participants will be randomly selected to receive 2 BUSD as well. We will deposit your reward directly into your margin account.',
      date: new Date(),
      category: '',
      active: true,
    },
    {
      header: 'Платформа XXX запущена на ПК',
      message: 'To provide you with the best margin trading experience, we are inviting you to participate in our Margin Trading Survey. It will only take you five minutes, and we will reward the first 1,000 participants with 2 BUSD each. Another 1,000 participants will be randomly selected to receive 2 BUSD as well. We will deposit your reward directly into your margin account.',
      date: new Date(),
      category: '',
      active: false,
    },
  ];

  constructor() { }

  getNotifications(params?: object): Observable<Notification[]> {
    return of(this.notifications);
  }
}
