import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserBalance, Wallet, WalletService } from '../../services/wallet.service';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { GridService } from '../../../shared/services/grid.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'cryptocurrency',
    'total',
    'available',
    'inOrder',
    'btcValue',
    'action',
  ];

  hideLowBalance: boolean;

  isLoading: boolean;

  count: number;

  tableData = [];

  fiatBalanceSource: MatTableDataSource<Wallet> = new MatTableDataSource<Wallet>(this.tableData);
  euroAccountBalanceSource: MatTableDataSource<Wallet> = new MatTableDataSource<Wallet>(this.tableData);
  cryptoBalanceSource: MatTableDataSource<Wallet> = new MatTableDataSource<Wallet>(this.tableData);

  searchInputControl = new FormControl();

  hideNumbers = true;
  coinTypes = [];
  walletBalance: UserBalance;

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

    this.walletService.getWalletBalance(this.route.snapshot.data.user.id)
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((walletBalance: UserBalance) => {
        this.walletBalance = walletBalance;
      });

    this.subscribeToRoutingChanges();
    this.subscribeToSearch();
  }

  getCoinTypes(balanceType: string, currencyType: string): void {
    this.coinTypes = this.walletService.serializedCoins;
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

  private subscribeToRoutingChanges(): void {
    this.route.queryParams
      .pipe(
        takeUntil(this.onDestroyed$),
        switchMap((params) => this.walletService.getWalletsList(params)),
      )
      .subscribe((walletsList: Wallet[]) => {
        this.isLoading = false;
        this.cryptoBalanceSource.data = walletsList;
        // this.dataSource.sort = this.sort;
        this.count = walletsList && walletsList.length;
      });
  }

  private subscribeToSearch(): void {
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this.onDestroyed$),
        debounceTime(500),
      )
      .subscribe((search: string) => {
        this.gridService.navigate({search});
      });
  }

}
