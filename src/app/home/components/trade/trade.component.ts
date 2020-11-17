import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ITradePairsData, TradeService } from '../../services/trade.service';
import { combineLatest, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { defaultPagination } from '../../../shared/constants/pagination.constant';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeComponent implements OnInit {
  isDarkTheme = false;

  leftContainer: string[] = [];
  centralContainer: string[] = [];
  rightContainer: string[] = [];

  isTradeTypeSelectorOpened = false;
  activeLink: string;
  limit = this.route.snapshot.queryParams.limit || defaultPagination.limit;

  searchInputControl = new FormControl();

  pairsDataSource$: Observable<MatTableDataSource<ITradePairsData>>;
  pairsDisplayedColumns = [
    'pair',
    'last_price',
    'change',
  ];

  constructor(
    private route: ActivatedRoute,
    private tradeService: TradeService,
  ) {
  }

  ngOnInit(): void {
    this.activeLink = this.route.snapshot.queryParams.tab || 'all';

    this.pairsDataSource$ = combineLatest(
      [
        this.searchInputControl.valueChanges
          .pipe(startWith(''), debounceTime(500), distinctUntilChanged()),
        this.route.queryParams,
      ]
    ).pipe(
      switchMap(([query, params]) => this.tradeService.getTradePairs(query, params)),
      map((v) => new MatTableDataSource<ITradePairsData>(v.results)),
    );
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

  toggleTradeSelector(popover): void {
    popover.toggle();
    this.isTradeTypeSelectorOpened = !this.isTradeTypeSelectorOpened;
  }

  playSpotTutorial(): void {
    this.isDarkTheme = !this.isDarkTheme;
  }

}
