import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IWidget } from 'src/app/shared/interfaces/widget.interface';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { MarketsService } from 'src/app/home/services/markets.service';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { IExchangeData } from 'src/app/shared/interfaces/exchange-data.interface';
import { ActivatedRoute, Router } from '@angular/router';

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
    'cng',
    'high',
    'low',
    'mktCap',
    'vol',
  ];
  limit = 2;

  dataSource: Observable<MatTableDataSource<IExchangeData[]>>;

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

    this.widgets = this.marketsService.getWidgetsData().pipe(
      takeUntil(this.onDestroyed$)
    );

    this.dataSource = combineLatest(
      this.searchInputControl.valueChanges.pipe(startWith(''), debounceTime(500), distinctUntilChanged()),
      this.route.queryParams
    ).pipe(
      switchMap(([query, params]) =>
        this.marketsService.loadResults(query, params).pipe(takeUntil(this.onDestroyed$))),
      map(result => {
        this.count = result.count;
        return result.results;
      })
    );
  }

  addToFavorite(element): void {
    element.favorite = !element.favorite;
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }
}
