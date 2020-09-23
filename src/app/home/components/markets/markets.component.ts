import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IWidget } from 'src/app/shared/interfaces/widget.interface';
import { Observable, Subject } from 'rxjs';
import { MarketsService } from 'src/app/home/services/markets.service';
import { takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { IExchangeData } from 'src/app/shared/interfaces/exchange-data.interface';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'favorite',
    'pair',
    'last',
    '24cng',
    '24high',
    '24low',
    'mktCap',
    '24vol',
  ];
  displayedData: string[] = [
    'favorite',
    'pair',
    'last',
    'cng',
    'high',
    'low',
    'mktCap',
    'vol',
  ];

  dataSource: Observable<MatTableDataSource<IExchangeData[]>>;

  pageType = 'markets_page';

  widgets: Observable<IWidget[]>;
  onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private marketsService: MarketsService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.navigate('favorite');

    this.widgets = this.marketsService.getWidgetsData().pipe(
      takeUntil(this.onDestroyed$)
    );
  }

  tabChanged(value): void {
    this.navigate(value);
  }

  navigate(value): void {
    this.router.navigate([window.location.pathname], {
      queryParams: {
        ...this.route.snapshot.queryParams,
        offset: 0,
        tab: _.snakeCase(value.tab ? value.tab.textLabel : value)
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }
}
