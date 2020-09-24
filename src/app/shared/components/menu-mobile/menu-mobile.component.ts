import { Component, OnInit } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

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

  constructor() {
  }

  ngOnInit(): void {
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
