import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { TradeService } from '../../services/trade.service';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ITradeCoinType, ITradePair } from '../../../core/interfaces/trade-pair.interface';
import { ThemeSettingsService } from '../../services/theme-settings.service';
import { ITheme, IThemeOptions } from '../../services/theme-settings.interface';

@Component({
  selector: 'app-trade-header',
  templateUrl: './trade-header.component.html',
  styleUrls: ['./trade-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeHeaderComponent implements OnInit {
  @Input() theme: Observable<ITheme>;

  isTradeTypeSelectorOpened = false;
  activeLink$: BehaviorSubject<ITradeCoinType> = new BehaviorSubject(ITradeCoinType.All);

  searchInputControl = new FormControl();

  pairsDataSource$: Observable<MatTableDataSource<ITradePair>>;
  pairsDisplayedColumns = [
    'pair',
    'last_price',
    'change',
  ];

  ActiveLinkType = ITradeCoinType;
  // TODO: remove when settings control is implemented
  isDark: boolean;

  constructor(
    private route: ActivatedRoute,
    private tradeService: TradeService,
    private themeSettingsService: ThemeSettingsService,
  ) {
  }

  ngOnInit(): void {
    this.pairsDataSource$ = combineLatest([
      this.searchInputControl.valueChanges
        .pipe(
          startWith(''),
          debounceTime(500),
          distinctUntilChanged(),
        ),
      this.activeLink$.asObservable(),
    ])
      .pipe(
        switchMap(([query, type]: [string, ITradeCoinType]) => this.tradeService.getTradePairs(query, type)),
        map((v) => new MatTableDataSource<ITradePair>(v.results))
      );
  }

  toggleTradeSelector(popover): void {
    popover.toggle();
    this.isTradeTypeSelectorOpened = !this.isTradeTypeSelectorOpened;
  }

  playSpotTutorial(): void {
    // TODO: remove when settings control is implemented
    this.isDark = this.themeSettingsService.currentTheme$.getValue() === ITheme.Dark;
    this.themeSettingsService.currentTheme$.next(this.isDark ? ITheme.Light : ITheme.Dark);
  }

}
