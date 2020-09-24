import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const icons: string[] = [
  'icon_user',
  'icon_notification',
  'icon_bitcoin',
  'icon_bitcoin_cash',
  'icon_bitcoin_sv',
  'icon_dash',
  'icon_eth',
  'icon_lightcoin',
  'icon_ripple',
  'icon_flag_en',
  'icon_facebook',
  'icon_instagram',
  'icon_linkedin',
  'icon_youtube',
  'icon_menu',
  'icon_bitcoin_widget',
  'icon_bitcoin_cash_widget',
  'icon_eth_widget',
  'icon_ark_widget',
  'icon_search',
  'icon_arrow_left',
  'icon_arrow_right',
  'icon_star',
  'icon_fill_star',
  'icon_view',
  'icon_eur',
  'icon_usd',
  'icon_union',
];

@Injectable({
  providedIn: 'root'
})
export class IconService {

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {
    this.loadIcons();
  }

  private loadIcons(): void {
    icons.forEach(icon => {
      this.matIconRegistry.addSvgIcon(icon, this.domSanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/${icon}.svg`));
    });
  }
}
