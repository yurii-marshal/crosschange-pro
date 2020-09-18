import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../../notifications/services/notifications.service';
import { Observable } from 'rxjs';
import { Notification } from '../../../core/interfaces/notification.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  notifications$: Observable<Notification[]>;

  constructor(private notificationsService: NotificationsService) { }

  ngOnInit(): void {
    this.notifications$ = this.notificationsService.getNotifications();
  }

}
