import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CoinsService } from '../../../shared/services/coins.service';
import { ICoin } from '../../../shared/interfaces/coin.interface';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { IWallet } from '../../../shared/interfaces/wallet.interface';
import { WalletService } from '../../services/wallet.service';
import { take, takeUntil } from 'rxjs/operators';
import { ITransactionItem } from '../../../shared/interfaces/transaction-item.interface';
import { IPaginationResponse } from '../../../shared/interfaces/pagination-response.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { QrCodeComponent } from '../qr-code/qr-code.component';
import { Devices, MediaBreakpointsService } from '../../../shared/services/media-breakpoints.service';

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
  deposits$: Observable<IPaginationResponse<ITransactionItem>>;
  popularSelected: ICoin;
  onDestroy$ = new Subject<void>();
  device$: Observable<Devices>;
  private readonly LIMIT = 10;

  get devices(): any {
    return Devices;
  }

  constructor(
    private coinService: CoinsService,
    private walletService: WalletService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private breakPoints: MediaBreakpointsService
  ) { }

  ngOnInit(): void {
    this.device$ = this.breakPoints.device.pipe(takeUntil(this.onDestroy$));

    const params = this.route.snapshot.queryParams;
    if (!('offset' in params) || !('limit' in params)) {
      this.navigateDefault();
    }

    this.popular$ = this.coinService.coinsPopularStream.pipe(takeUntil(this.onDestroy$));
    this.wallets$ = this.walletService.walletsStream.pipe(takeUntil(this.onDestroy$));
    this.deposits$ = this.walletService.depositsStream.pipe(takeUntil(this.onDestroy$));

    this.coinService.getCoins();
    this.walletService.getWallets();
    combineLatest(
      [
        this.selected$,
        this.route.queryParams
      ]
    ).pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(([selected, qParams]) => {
      this.walletService.getDepositHistory({ cryptocurrency: selected && selected.key, ...qParams });
    });
  }

  onCoinSelect(coin: ICoin): void {
    this.selected$.next(coin);
    this.navigateDefault();
  }

  navigateDefault(): void {
    this.router.navigate([window.location.pathname], {queryParams: { offset: 0, limit: this.LIMIT } });
  }

  selectPopular(coin: ICoin): void {
    this.popularSelected = coin;
  }

  openQrDialog(): void {
    this.wallets$.pipe(take(1)).subscribe(wallets => {
      const selected = this.selected$.getValue();
      const wallet = wallets.filter(v => v.cryptocurrency === (selected && selected.key)).shift();
      if (!wallet) {
        return;
      }
      const ref = this.dialog.open(QrCodeComponent, {
        data: wallet,
        panelClass: 'qr-code-dialog'
      });
    });
  }

  sort(field: 'date' | 'amount' | 'status'): void {}

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }


}
