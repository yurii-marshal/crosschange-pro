import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  menuItems = [
    {active: false, label: 'header.markets'},
    {active: false, label: 'header.wallet'},
    {active: false, label: 'header.exchange'},
    {active: false, label: 'header.history'},
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

  openMenuMobile(MenuMobile): void {
    MenuMobile.open();
    document.body.style.overflow = 'hidden';
  }

  closeMenuMobile(MenuMobile): void {
    MenuMobile.close();
    document.body.style.overflow = 'auto';
  }

}
