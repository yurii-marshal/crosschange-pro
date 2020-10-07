import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { IUserBalance, WalletService } from '../../services/wallet.service';
import { debounceTime, distinctUntilChanged, map, share, startWith, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { IWallet } from '../../../shared/interfaces/wallet.interface';
import { SsoUser } from 'shared-kuailian-lib';

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

  count: number;

  fiatBalanceSource: Observable<MatTableDataSource<IWallet>>;
  euroAccountBalanceSource: Observable<MatTableDataSource<IWallet>>;
  cryptoBalanceSource: Observable<MatTableDataSource<IWallet>>;

  searchInputControl = new FormControl();

  hideNumbers = true;
  coinTypes;
  walletBalance$: Observable<IUserBalance>;

  hideLowBalance$ = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('hideLowBalance')) || false);

  constructor(
    private route: ActivatedRoute,
    public walletService: WalletService,
  ) {
  }

  ngOnInit(): void {
    const user: SsoUser = this.route.snapshot.data.user;
    this.walletBalance$ = this.walletService.getWalletBalance(user.uuid).pipe(share());

    this.cryptoBalanceSource = combineLatest([
      this.searchInputControl.valueChanges
        .pipe(
          startWith(''),
          debounceTime(500),
          distinctUntilChanged(),
        ),
      this.route.queryParams,
      this.hideLowBalance$,
    ]).pipe(
      switchMap(([search, params, hideLowBalance]) =>
        this.walletService.getWalletsList({...params, ...{search}, ...{hideLowBalance}})),
      share(),
      map(result => {
        this.count = result.count;
        localStorage.setItem('hideLowBalance', JSON.stringify(this.hideLowBalance$.getValue()));
        return new MatTableDataSource(result.results);
      }),
    );
  }

  getCoinTypes(balanceType: string, currencyType: string): void {
    this.coinTypes = this.walletService.serializedCoinsMockData;
  }
}
