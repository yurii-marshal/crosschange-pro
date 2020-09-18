import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../../notifications/services/notifications.service';
import { Observable } from 'rxjs';
import { Notification } from '../../../core/interfaces/notification.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  notifications$: Observable<Notification[]>;

  constructor(
    private notificationsService: NotificationsService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.notifications$ = this.notificationsService.getNotifications({limit: 3});
  }

  openNotificationsPage(menuTrigger): void {
    this.router.navigate(['/notifications'], { queryParams: { type: '' } });
    menuTrigger.closeMenu();
  }

}
