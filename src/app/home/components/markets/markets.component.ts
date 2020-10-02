import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IWidget } from 'src/app/shared/interfaces/widget.interface';
import { combineLatest, Observable, Subject } from 'rxjs';
import { MarketsService } from 'src/app/home/services/markets.service';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { IExchangeData } from 'src/app/shared/interfaces/exchange-data.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { defaultPagination } from 'src/app/shared/constants/pagination.constant';

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'favorite',
    'exchange_type',
    'exchange_rate',
    'change_perce_24',
    'high_24',
    'low_24',
    'market_cap',
    'vol_24',
  ];
  limit = this.route.snapshot.queryParams.limit || defaultPagination.limit;
  currentOrdering = '';

  dataSource: Observable<MatTableDataSource<IExchangeData>>;

  searchInputControl = new FormControl();

  count: number;
  activeLink: string;

  widgets: Observable<IWidget[]>;
  onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private marketsService: MarketsService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.router.navigate([window.location.pathname], {
      queryParams: {
        ...this.route.snapshot.queryParams,
        tab: this.route.snapshot.queryParams.tab || 'favorite',
      }
    });
    this.activeLink = this.route.snapshot.queryParams.tab || 'favorite';

    this.widgets = this.marketsService.getWidgetsData();

    this.dataSource = combineLatest(
      this.searchInputControl.valueChanges.pipe(startWith(''), debounceTime(500), distinctUntilChanged()),
      this.route.queryParams
    ).pipe(
      switchMap(([query, params]) =>
        this.marketsService.loadPairs(query, params)),
      map(result => {
        this.count = result.count;
        return new MatTableDataSource(result.results);
      })
    );
  }

  addToFavorite(element): void {
    element.favorite = !element.favorite;
  }

  orderBy(value: string): void {
    switch (this.currentOrdering) {
      case value:
        this.currentOrdering = `-${value}`;
        break;
      case `-${value}`:
        this.currentOrdering = null;
        break;
      default:
        this.currentOrdering = value;
    }

    this.router.navigate([window.location.pathname], {
      queryParams: {
        ...this.route.snapshot.queryParams,
        orderby: this.currentOrdering,
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }
}
