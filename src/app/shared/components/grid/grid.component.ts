import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { GridService } from 'src/app/shared/services/grid.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnDestroy {
  @Input() pageType: string;

  @Input() currentTab: string;

  @Input() displayedColumns: string[];
  @Input() displayedData: string[];

  count: number;
  searchInputControl = new FormControl();

  dataSource: Observable<MatTableDataSource<any>>;

  onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private gridService: GridService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.dataSource = combineLatest(
      this.searchInputControl.valueChanges.pipe(startWith(''), debounceTime(500), distinctUntilChanged()),
      this.route.queryParams
    ).pipe(
      filter(([query, params]) => this.currentTab === params.tab),
      switchMap(([query, params]) =>
        this.gridService.loadResults(query, params).pipe(takeUntil(this.onDestroyed$))),
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
