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

export class TradeComponent implements OnInit {
  theme = IThemes.Light;

  leftContainer: string[] = [];
  centralContainer: string[] = [];
  rightContainer: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private marketService: MarketsService,
  ) {
  }

  ngOnInit(): void {
    if (!this.route.snapshot.queryParams.pair) {
      this.navigateDefault();
    }
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

  private navigateDefault(): void {
    // TODO: get default pair if params are empty
    this.marketService.getPairs()
      .pipe(take(1))
      .subscribe(pairs =>
        this.router.navigate([window.location.pathname], {queryParams: {pair: pairs[0] ? pairs[0].exchange_type : ''}}));
  }

}

_([
  'trade_page.orderbook',
  'trade_page.chart',
  'trade_page.exchange',
  'trade_page.market_trades',
  'trade_page.orders_and_history',
]);
