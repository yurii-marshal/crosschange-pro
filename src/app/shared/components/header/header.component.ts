import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NotificationsService } from '../../../notifications/services/notifications.service';
import { Observable } from 'rxjs';
import { Notification } from '../../../core/interfaces/notification.interface';
import { Router } from '@angular/router';
import { SsoService, SessionService } from 'shared-kuailian-lib';
import { tap } from 'rxjs/operators';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

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
    {active: false, label: 'header.buy_crypto', link: '/buy-crypto'},
    {active: false, label: 'header.exchange', link: '.'},
    {active: false, label: 'header.markets', link: '/markets'},
    {active: false, label: 'header.wallets', link: '.'},
    {active: false, label: 'header.orders', link: '.'},
  ];

  userSubmenu: boolean;

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
    this.notifications$ = this.notificationsService.getNotifications({isNew: true});
  }

  openNotificationsPage(refNotesPopover): void {
    refNotesPopover.close();
    this.router.navigate(['/notifications'], { queryParams: { type: '' } });
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

_([
  'header.buy_crypto',
  'header.markets',
  'header.wallets',
  'header.exchange',
  'header.orders',
]);
