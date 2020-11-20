import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { TradeService } from '../../services/trade.service';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { IThemes } from '../trade/trade.component';
import { ITradeCoinType, ITradePair } from '../../../core/interfaces/trade-pair.interface';

@Component({
  selector: 'app-trade-header',
  templateUrl: './trade-header.component.html',
  styleUrls: ['./trade-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeHeaderComponent implements OnInit {
  @Input() theme: string;

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

  constructor(
    private route: ActivatedRoute,
    private tradeService: TradeService,
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
    this.theme = IThemes.Dark;
  }

}
