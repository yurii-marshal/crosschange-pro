import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NotificationsService } from '../../../notifications/services/notifications.service';
import { Observable } from 'rxjs';
import { Notification } from '../../../core/interfaces/notification.interface';
import { Router } from '@angular/router';
import { SsoService, SessionService } from 'shared-kuailian-lib';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  @Input() menuMobile;

  notifications$: Observable<Notification[]>;

  menuItems = [
    {active: false, label: 'header.markets'},
    {active: false, label: 'header.wallet'},
    {active: false, label: 'header.exchange'},
    {active: false, label: 'header.history'},
  ];

  get isLoggedIn(): boolean {
    return this.sessionService.isAuthenticated;
  }

  constructor(
    private ssoService: SsoService,
    private sessionService: SessionService,
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

  logout(): void {
    this.ssoService.logout().pipe(
      tap(() => this.sessionService.removeSession())
    ).subscribe();
  }

  openMenuMobile(MenuMobile): void {
    MenuMobile.open();
    document.body.style.overflow = 'hidden';
  }

}
