import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Subject } from 'rxjs';
import { ThemeSettingsService } from '../../services/theme-settings.service';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeComponent implements OnInit, OnDestroy {
  leftContainer: string[] = [];
  centralContainer: string[] = [];
  rightContainer: string[] = [];

  onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    public themeSettingsService: ThemeSettingsService,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

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
