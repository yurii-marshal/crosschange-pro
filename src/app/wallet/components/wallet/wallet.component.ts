import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { IUserBalance, WalletService } from '../../services/wallet.service';
import { debounceTime, distinctUntilChanged, filter, map, share, startWith, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { IWallet } from '../../../shared/interfaces/wallet.interface';
import { defaultPagination } from '../../../shared/constants/pagination.constant';
import { UserService } from '../../../shared/services/user.service';

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

  cryptoBalanceCount = 0;

  fiatBalanceSource: Observable<MatTableDataSource<IWallet>>;
  euroAccountBalanceSource: Observable<MatTableDataSource<IWallet>>;
  cryptoBalanceSource: Observable<MatTableDataSource<IWallet>>;

  searchInputControl = new FormControl();

  walletBalance$: Observable<IUserBalance>;
  cryptoPairs: string[];
  pairs: string[];

  hideLowBalance$ = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('hideLowBalance')) || false);
  hideNumbers$ = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('hideNumbers')));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    public walletService: WalletService,
  ) {
  }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;

    if (!('offset' in queryParams) || !('limit' in queryParams)) {
      this.navigateDefault();
    }

    this.fiatBalanceSource = this.route.queryParams
      .pipe(
        share(),
        distinctUntilChanged(),
        switchMap(params => this.walletService.getFiatList(params)),
        map((res) => new MatTableDataSource(res.results)),
      );

    this.cryptoBalanceSource = combineLatest([
      this.searchInputControl.valueChanges
        .pipe(
          startWith(''),
          debounceTime(500),
          distinctUntilChanged(),
        ),
      this.route.queryParams,
      this.hideLowBalance$,
      this.walletService.getCryptoPairs(),
      this.userService.getUserInfo(),
    ]).pipe(
      switchMap(([search, params, hideLowBalance, cryptoPairs, user]) => {
        this.cryptoPairs = cryptoPairs;
        this.walletBalance$ = this.walletService.getWalletBalance(user.uuid).pipe(share());
        return this.walletService.getWalletsList({...params, ...{search}, ...{hideLowBalance}});
      }),
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
    this.pairs = this.cryptoPairs.filter(pair => pair.split('/')[0] === coinType.toUpperCase());
  }

  private navigateDefault(): void {
    this.router.navigate([window.location.pathname], {queryParams: {offset: defaultPagination.offset, limit: defaultPagination.limit}});
  }
}
