import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { tap } from 'rxjs/operators';
import { SsoService, SessionService } from 'shared-kuailian-lib';

@Component({
  selector: 'app-menu-mobile',
  templateUrl: './menu-mobile.component.html',
  styleUrls: ['./menu-mobile.component.scss']
})
export class MenuMobileComponent implements OnInit {
  @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();

  menuItems = [
    {label: 'menu_mobile.buy_crypto', active: false, link: '/buy-crypto'},
    {label: 'menu_mobile.markets', active: false, link: '/markets'},
    {
      label: 'menu_mobile.wallet',
      active: false,
      link: '.',
      subItems: [
        {label: 'menu_mobile.spot_wallet', icon: 'icon_wallet', link: '/wallet/balance'},
        {label: 'menu_mobile.margin_wallet', icon: 'icon_meter', link: '/wallet/balance'},
      ],
    },
    {label: 'menu_mobile.exchange', active: false, link: '/trade'},
    {label: 'menu_mobile.history', active: false, link: '/history'},
    {label: '', active: false, link: ''},
  ];

  constructor(
    private ssoService: SsoService,
    private sessionService: SessionService,
  ) {
  }

  ngOnInit(): void {
  }

  openPage(item): void {
    item.active = !item.active;

    if (item.link !== '.') {
      this.closeMenu.emit();
    }
  }

  logout(): void {
    this.ssoService.logout().pipe(
      tap(() => this.sessionService.removeSession())
    ).subscribe();
  }

}

_([
  'menu_mobile.markets',
  'menu_mobile.wallet',
  'menu_mobile.spot_wallet',
  'menu_mobile.margin_wallet',
  'menu_mobile.exchange',
  'menu_mobile.history',
]);
