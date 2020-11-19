import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export enum IThemes {
  Light = 'theme-light',
  Dark = 'theme-dark',
  Professional = 'theme-professional',
}

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeComponent {
  theme = IThemes.Light;

  leftContainer: string[] = [];
  centralContainer: string[] = [];
  rightContainer: string[] = [];

  constructor() {}

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

}

_([
  'trade_page.orderbook',
  'trade_page.chart',
  'trade_page.exchange',
  'trade_page.market_trades',
  'trade_page.orders_and_history',
]);