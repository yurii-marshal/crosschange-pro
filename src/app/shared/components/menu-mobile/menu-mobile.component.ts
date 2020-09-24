import { Component, OnInit } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { tap } from 'rxjs/operators';
import { SsoService, SessionService } from 'shared-kuailian-lib';

@Component({
  selector: 'app-menu-mobile',
  templateUrl: './menu-mobile.component.html',
  styleUrls: ['./menu-mobile.component.scss']
})
export class MenuMobileComponent implements OnInit {

  menuItems = [
    {label: 'menu_mobile.markets', active: false},
    {
      label: 'menu_mobile.wallet',
      active: false,
      subItems: [
        {label: 'menu_mobile.spot_wallet', icon: 'icon_wallet'},
        {label: 'menu_mobile.margin_wallet', icon: 'icon_meter'},
      ],
    },
    {label: 'menu_mobile.exchange', active: false},
    {label: 'menu_mobile.history', active: false},
    {label: '', active: false},
  ];

  constructor(
    private ssoService: SsoService,
    private sessionService: SessionService,
  ) {
  }

  ngOnInit(): void {
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
