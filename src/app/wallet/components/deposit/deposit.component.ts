import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CoinsService } from '../../../shared/services/coins.service';
import { ICoin } from '../../../shared/interfaces/coin.interface';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { IWallet } from '../../../shared/interfaces/wallet.interface';
import { WalletService } from '../../services/wallet.service';
import { takeUntil } from 'rxjs/operators';
import { ITransactionItem } from '../../../shared/interfaces/transaction-item.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Devices } from '../../../shared/services/media-breakpoints.service';
import { IApiResponse } from 'shared-kuailian-lib';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositComponent implements OnInit, OnDestroy {
  selected$: BehaviorSubject<ICoin> = new BehaviorSubject<ICoin | null>(null);
  popular$: Observable<ICoin[]>;
  wallets$: Observable<IWallet[]>;
  deposits$: Observable<IApiResponse<ITransactionItem>>;
  popularSelected: ICoin;
  onDestroy$ = new Subject<void>();
  device$: Observable<Devices>;
  coinSelect = new FormControl();

  private readonly LIMIT = 10;

  constructor(
    private coinService: CoinsService,
    private walletService: WalletService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    if (!('offset' in params) || !('limit' in params)) {
      this.navigateDefault();
    }

    this.popular$ = this.coinService.getPopular();
    this.wallets$ = this.walletService.getWallets();

    combineLatest(
      [
        this.selected$,
        this.route.queryParams
      ]
    ).pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(([selected, qParams]) => {
      this.deposits$ = this.getHistory(selected, qParams);
    });
  }

  getHistory(selected, qParams): Observable<IApiResponse<ITransactionItem>> {
    return this.walletService.getDepositHistory({cryptocurrency: selected && selected.key, ...qParams});
  }

  onCoinSelect(coin: ICoin): void {
    this.selected$.next(coin);
    this.navigateDefault();
    // TODO: REFACTOR
    setTimeout(() => this.ref.markForCheck());
  }

  navigateDefault(): void {
    this.router.navigate(
      [window.location.pathname],
      {queryParams: {offset: 0, limit: this.route.snapshot.queryParams.limit || this.LIMIT}}
    );
  }

  selectPopular(coin: ICoin): void {
    this.coinSelect.setValue(coin);
  }

  sort(field: 'date' | 'amount' | 'status'): void {
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
