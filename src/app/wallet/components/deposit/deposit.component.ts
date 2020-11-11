import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoinsService } from '../../../shared/services/coins.service';
import { ICoin } from '../../../shared/interfaces/coin.interface';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { IWallet } from '../../../shared/interfaces/wallet.interface';
import { WalletService } from '../../services/wallet.service';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ITransactionItem } from '../../../shared/interfaces/transaction-item.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Devices } from '../../../shared/services/media-breakpoints.service';
import { IApiResponse } from 'shared-kuailian-lib';
import { FormControl } from '@angular/forms';
import { DepositService } from '../../services/deposit.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss'],
})
export class DepositComponent implements OnInit, OnDestroy {
  selected$: BehaviorSubject<ICoin> = new BehaviorSubject<ICoin | null>(null);
  popular$: Observable<ICoin[]>;
  wallets$: Observable<IWallet[]>;
  deposits$: Observable<IApiResponse<ITransactionItem>>;
  popularSelected: ICoin;
  onDestroy$ = new Subject<void>();
  device$: Observable<Devices>;
  qrCode$: Observable<any>;
  coinSelect = new FormControl();

  private readonly LIMIT = 10;

  constructor(
    private coinService: CoinsService,
    private depositService: DepositService,
    private walletService: WalletService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;

    if (!('offset' in params) || !('limit' in params)) {
      this.navigateDefault();
    }

    this.popular$ = this.coinService.getPopular();
    this.wallets$ = this.walletService.getWallets();

    combineLatest([
      this.route.queryParams,
      this.selected$,
    ])
      .pipe(takeUntil(this.onDestroy$), distinctUntilChanged())
      .subscribe(([qParams, selected]) => {
        this.deposits$ = this.getHistory(selected, qParams);
      });
  }

  getHistory(selected, qParams): Observable<IApiResponse<ITransactionItem>> {
    return this.depositService.getDepositHistory({cryptocurrency: selected && selected.key, ...qParams});
  }

  onCoinSelect(coin: ICoin): void {
    this.selected$.next(coin);
    this.navigateDefault();
  }

  navigateDefault(): void {
    this.router.navigate(
      [ window.location.pathname ],
      { queryParams: { offset: 0, limit: this.route.snapshot.queryParams.limit || this.LIMIT } }
    );
  }

  selectPopular(coin: ICoin): void {
    this.coinSelect.setValue(coin);
  }

  sort(field: 'date' | 'amount' | 'status'): void {
    // TODO: IMPLEMENT
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
