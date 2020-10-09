import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { IUserBalance, WalletService } from '../../services/wallet.service';
import { debounceTime, distinctUntilChanged, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { IWallet } from '../../../shared/interfaces/wallet.interface';
import { SsoUser } from 'shared-kuailian-lib';
import { defaultPagination } from '../../../shared/constants/pagination.constant';

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

  cryptoBalanceCount: number;

  fiatBalanceSource: Observable<MatTableDataSource<IWallet>>;
  euroAccountBalanceSource: Observable<MatTableDataSource<IWallet>>;
  cryptoBalanceSource: Observable<MatTableDataSource<IWallet>>;

  searchInputControl = new FormControl();

  coinTypes;
  walletBalance$: Observable<IUserBalance>;
  coinPairs$: Observable<string[]>;

  hideLowBalance$ = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('hideLowBalance')) || false);
  hideNumbers$ = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('hideNumbers')));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public walletService: WalletService,
  ) {
  }

  ngOnInit(): void {
    const user: SsoUser = this.route.snapshot.data.user;
    this.walletBalance$ = this.walletService.getWalletBalance(user.uuid).pipe(share());
    this.coinPairs$ = this.walletService.getPairs('');

    const queryParams = this.route.snapshot.queryParams;

    if (!('offset' in queryParams) || !('limit' in queryParams)) {
      this.navigateDefault();
    }

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
        this.cryptoBalanceCount = result.count;
        return new MatTableDataSource(result.results);
      }),
    );
  }

  toggleNumVisibility(): void {
    this.hideNumbers$.next(!this.hideNumbers$.getValue());
    localStorage.setItem('hideNumbers', JSON.stringify(this.hideNumbers$.getValue()));
  }

  toggleLowBalance(): void {
    this.hideLowBalance$.next(!this.hideLowBalance$.getValue());
    localStorage.setItem('hideLowBalance', JSON.stringify(this.hideLowBalance$.getValue()));
  }

  getCryptoPairs(coinType: string): void {
    this.coinPairs$ = this.walletService.getPairs(coinType);
  }

  private navigateDefault(): void {
    this.router.navigate([window.location.pathname], {queryParams: {offset: defaultPagination.offset, limit: defaultPagination.limit}});
  }
}
