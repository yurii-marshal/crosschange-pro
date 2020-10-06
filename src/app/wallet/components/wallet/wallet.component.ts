import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IBalanceInfo } from 'src/app/shared/interfaces/balance-info.interface';
import { FormControl } from '@angular/forms';
import { TradeType } from '../../../core/interfaces/trade-type.interface';
import { Observable, Subject } from 'rxjs';
import { WalletService } from '../../services/wallet.service';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { GridService } from '../../../shared/services/grid.service';
import { ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'coin',
    'total',
    'available',
    'inOrder',
    'btcValue',
    'action'
  ];

  hideLowBalance: boolean;

  isLoading: boolean;

  count = 81;

  tableData = [];

  dataSource: MatTableDataSource<IBalanceInfo> = new MatTableDataSource<IBalanceInfo>(this.tableData);

  searchInputControl = new FormControl();

  hideNumbers = true;
  tradeTypes$: Observable<TradeType[]>;

  sort: MatSort;

  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    public walletService: WalletService,
    private gridService: GridService,
  ) {
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this.onDestroyed$),
        debounceTime(500),
      )
      .subscribe((search: string) => {
        this.gridService.navigate({search});
      });

    this.route.queryParams
      .pipe(
        takeUntil(this.onDestroyed$),
        switchMap((params) => this.walletService.getWalletsBalance(params))
      )
      .subscribe((walletsBalance: any) => {
        this.isLoading = false;
        this.dataSource.data = walletsBalance;
        this.dataSource.sort = this.sort;
        this.count = 81;
      });
  }

  getTradeTypes(balanceType: string, currencyType: string): void {
    this.tradeTypes$ = this.walletService.getTradeTypes(balanceType, currencyType);
  }

  toggleLowBalance(): void {
    this.isLoading = true;
    this.hideLowBalance = !this.hideLowBalance;

    this.gridService.navigate({hideLowBalance: this.hideLowBalance});
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

}
