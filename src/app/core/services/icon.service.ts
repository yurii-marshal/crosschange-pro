import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const icons: string[] = [
  'icon_user',
  'icon_notification',
  'icon_notification_new',
  'icon_btc',
  'icon_bth',
  'icon_bch',
  'icon_bsv',
  'icon_ceur',
  'icon_dash',
  'icon_eth',
  'icon_ltc',
  'icon_xrp',
  'icon_usdt',
  'icon_usdc',
  'icon_xtz',
  'icon_ark',
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
  'icon_menu',
  'icon_meter',
  'icon_wallet',
  'icon_kuailian_bank',
  'icon_credit_card',
  'icon_close',
  'icon_close_dark',
  'icon_arrow_down',
  'icon_view',
  'icon_view_crossed',
  'icon_eur',
  'icon_usd',
  'icon_union',
  'icon_copy',
  'icon_qr_code',
  'icon_sort',
  'icon_chevron_up',
  'icon_chevron_down',
  'icon_chevron_up_dark',
  'icon_chevron_down_dark',
  'icon_direction',
  'icon_triangle_up',
  'icon_arrows',
  'icon_hourglass',
  'icon_checkmark',
  'icon_security',
  'icon_logout',
  'icon_warning_circle',
  'icon_whitelist',
  'icon_trash',
  'icon_caret_up',
  'icon_caret_down',
  'icon_play',
  'icon_resize_up',
  'icon_resize_down',
  'icon_draggable',
  'icon_calendar',
  'icon_circle',
  'icon_circle_green',
  'icon_circle_red',
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
