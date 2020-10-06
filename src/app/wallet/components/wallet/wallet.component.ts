import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { UserBalance, WalletService } from '../../services/wallet.service';
import { debounceTime, distinctUntilChanged, map, share, startWith, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { GridService } from '../../../shared/services/grid.service';
import { IWallet } from '../../../shared/interfaces/wallet.interface';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
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

  fiatBalanceSource: Observable<MatTableDataSource<IWallet>>;
  euroAccountBalanceSource: Observable<MatTableDataSource<IWallet>>;
  cryptoBalanceSource: Observable<MatTableDataSource<IWallet>>;

  searchInputControl = new FormControl();

  hideNumbers = true;
  coinTypes = [];
  walletBalance$: Observable<UserBalance>;

  constructor(
    private route: ActivatedRoute,
    private gridService: GridService,
    public walletService: WalletService,
  ) {
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.walletBalance$ = this.walletService.getWalletBalance(this.route.snapshot.data.user.id).pipe(share());

    this.cryptoBalanceSource = combineLatest(
      this.searchInputControl.valueChanges
        .pipe(
          startWith(''),
          debounceTime(500),
          distinctUntilChanged(),
        ),
      this.route.queryParams,
    ).pipe(
      switchMap(([query, params]) =>
        this.walletService.getWalletsList({...params, ...{search: query}})),
      share(),
      map(result => {
        this.count = result.count;
        return new MatTableDataSource(result.results);
      }),
    );
  }

  getCoinTypes(balanceType: string, currencyType: string): void {
    this.coinTypes = this.walletService.serializedCoins;
  }

  toggleLowBalance(): void {
    this.isLoading = true;
    this.hideLowBalance = !this.hideLowBalance;

    this.gridService.navigate({hideLowBalance: this.hideLowBalance});
  }

}
