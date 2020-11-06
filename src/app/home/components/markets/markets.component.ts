import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { MarketsService } from 'src/app/home/services/markets.service';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { IExchangeData } from 'src/app/shared/interfaces/exchange-data.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { defaultPagination } from 'src/app/shared/constants/pagination.constant';
import { ICurrency } from 'src/app/shared/interfaces/currency.interface';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MAT_SELECT_SCROLL_STRATEGY, useFactory: MarketsService.scrollFactory, deps: [Overlay] }
  ]
})
export class MarketsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'favorite',
    'exchange_type',
    'exchange_rate',
    'change_percent_24',
    'high_24',
    'low_24',
    'market_cap',
    'vol_24',
  ];
  limit = this.route.snapshot.queryParams.limit || defaultPagination.limit;
  currentOrdering = '';

  dataSource$: BehaviorSubject<MatTableDataSource<IExchangeData>> = new BehaviorSubject(new MatTableDataSource([]));

  searchInputControl = new FormControl();

  defaultFilterValue = {key: 'All Coins', fields: {name: 'All Coins', isFiat: false}};
  searchFilterControl = new FormControl(this.defaultFilterValue);

  count = 0;

  activeLink: string;
  isFiat: boolean;

  currencies$: Observable<ICurrency[]>;
  fiatCurrencies$: Observable<ICurrency[]>;
  cryptoCurrencies$: Observable<ICurrency[]>;

  widgets$: Observable<IExchangeData[]>;
  onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private marketsService: MarketsService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.widgets$ = this.marketsService.loadWidgetsData();
    this.currencies$ = this.marketsService.loadDropdownData();

    this.fiatCurrencies$ = this.currencies$.pipe(
      map(currency => currency.filter(item => item.fields.isFiat))
    );
    this.cryptoCurrencies$ = this.currencies$.pipe(
      map(currency => currency.filter(item => !item.fields.isFiat))
    );

    // TODO: REFACTOR
    this.marketsService.getPairs()
      .pipe(
        takeUntil(this.onDestroyed$),
        map((newData) => {
          const data = this.dataSource$.getValue().data;
          return data.map((oldItem) => {
            const newItem = newData.find((d) => d.exchange_type === oldItem.exchange_type);
            return newItem ? Object.assign({}, oldItem, newItem) : oldItem;
          });
        })
      )
      .subscribe((v) => {
        this.dataSource$.next(new MatTableDataSource<IExchangeData>(v));
      });

    this.activeLink = this.route.snapshot.queryParams.tab || 'favorite';

    combineLatest(
      [
        this.searchInputControl.valueChanges.pipe(startWith(''), debounceTime(500), distinctUntilChanged()),
        this.searchFilterControl.valueChanges.pipe(startWith(''), distinctUntilChanged()),
        this.route.queryParams
      ]
    ).pipe(
      takeUntil(this.onDestroyed$),
      switchMap(([query, dropdown, params]) => {
        this.isFiat = params.tab === 'fiat';
        return this.marketsService.loadPairs(query, dropdown.key, params);
      }),
    ).subscribe(result => {
      this.count = result.count;
      this.dataSource$.next(new MatTableDataSource(result.results));
    });
  }

  setFavourite(element): void {
    const fn = element.is_favorite ? 'deleteFromFavourite' : 'addToFavorite';
    this.marketsService[fn](element.exchange_type).pipe(
      takeUntil(this.onDestroyed$)
    ).subscribe(() => {
      element.is_favorite = !element.is_favorite;
      this.cdr.detectChanges();
    });
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

  widgetTracker(item: IExchangeData): string {
    return item.exchange_type;
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }
}
