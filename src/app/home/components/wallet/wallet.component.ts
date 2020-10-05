import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IBalanceInfo } from 'src/app/shared/interfaces/balance-info.interface';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { Coin, Wallet, WalletService } from '../../services/wallet.service';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';
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

  count: number;

  tableData = [];

  dataSource: MatTableDataSource<Wallet> = new MatTableDataSource<Wallet>(this.tableData);

  searchInputControl = new FormControl();

  hideNumbers = true;
  coinTypes: Coin[] = [];

  // sort: MatSort;

  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private gridService: GridService,
    public walletService: WalletService,
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
        switchMap((params) => this.walletService.getWalletsList(params)),
        tap((walletsList: Wallet[]) => {
          this.isLoading = false;
          this.dataSource.data = walletsList;
          // this.dataSource.sort = this.sort;
          this.count = walletsList && walletsList.length;
        }),
        switchMap(() => this.walletService.getCoinTypes()),
      )
      .subscribe((coinTypes: Coin[]) => {});
  }

  getCoinTypes(balanceType: string, currencyType: string): void {
    this.coinTypes = this.walletService.serializedCoins[balanceType] && this.walletService.serializedCoins[balanceType][currencyType];
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
