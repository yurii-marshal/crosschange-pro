import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  /*
  * status.crosschange.exchange
    https://crosschange-bank.zendesk.com
  * */
  crypto = [
    {
      icon: 'icon_bitcoin',
      title: 'BTC',
      subtitle: 'Bitcoin',
      total: '0.00000000',
      available: '+00.00',
    },
    {
      icon: 'icon_bitcoin_cash',
      title: 'BTC',
      subtitle: 'Bitcoin Cash',
      total: '0.00000000',
      available: '+00.00',
    },
    {
      icon: 'icon_bitcoin_sv',
      title: 'BTC',
      subtitle: 'Bitcoin SV',
      total: '0.00000000',
      available: '+00.00',
    },
    {
      icon: 'icon_dash',
      title: 'BTC',
      subtitle: 'Dash',
      total: '0.00000000',
      available: '+00.00',
    },
    {
      icon: 'icon_eth',
      title: 'BTC',
      subtitle: 'Basic Attention',
      total: '0.00000000',
      available: '+00.00',
    },
    {
      icon: 'icon_lightcoin',
      title: 'BTC',
      subtitle: 'Litecoin',
      total: '0.00000000',
      available: '+00.00',
    },
    {
      icon: 'icon_ripple',
      title: 'BTC',
      subtitle: 'Ripple',
      total: '0.00000000',
      available: '+00.00',
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}


_([
  'main_page.howto_title_1',
  'main_page.howto_text_1',
  'main_page.howto_link_1',
  'main_page.howto_title_2',
  'main_page.howto_text_2',
  'main_page.howto_link_2',
  'main_page.howto_title_3',
  'main_page.howto_text_3',
  'main_page.howto_link_3',
]);
