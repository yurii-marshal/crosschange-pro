import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICoin } from '../../../shared/interfaces/coin.interface';
import { combineLatest, Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CoinsService } from '../../../shared/services/coins.service';
import { IApiResponse } from 'shared-kuailian-lib';
import { IWithdrawItem } from '../../../shared/interfaces/withdraw-item.interface';
import {
  distinctUntilChanged,
  skip,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { WithdrawService } from '../../services/withdraw.service';
import { IWallet } from '../../../shared/interfaces/wallet.interface';
import { WalletService } from '../../services/wallet.service';
import { IAddress } from '../../../shared/interfaces/address.interface';
import { AddressService } from '../../../shared/services/address.service';
import { defaultPagination } from '../../../shared/constants/pagination.constant';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss', './../deposit/deposit.component.scss']
})
export class WithdrawComponent implements OnInit, OnDestroy {
  transactionFee = 0;
  popular$: Observable<ICoin[]>;
  wallets$: Observable<IWallet[]>;
  addresses$: Observable<IAddress[]>;
  withdraws: IApiResponse<IWithdrawItem>;
  onDestroy$ = new Subject<void>();

  withdrawForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private coinsService: CoinsService,
    private withdrawService: WithdrawService,
    private walletService: WalletService,
    private addressService: AddressService,
  ) {
  }

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;

    if (!('offset' in params) || !('limit' in params)) {
      this.router.navigate(['.'], {
        relativeTo: this.route, queryParams:
          {offset: defaultPagination.offset, limit: defaultPagination.limit}
      });
    }

    this.withdrawForm = new FormGroup({
      tag: new FormControl('', []),
      amount: new FormControl('', [Validators.required]),
      coinSelect: new FormControl('', [Validators.required]),
      recipientAddressSelect: new FormControl('', [Validators.required]),
    });

    this.popular$ = this.coinsService.getPopular();
    this.wallets$ = this.walletService.getWallets();
    this.addresses$ = this.addressService.getRecipientAddresses();

    const addressChanges$ = this.withdrawForm.get('recipientAddressSelect').valueChanges.pipe(startWith(''), distinctUntilChanged());
    const coinChanges$ = this.withdrawForm.get('coinSelect').valueChanges.pipe(startWith(''), distinctUntilChanged());
    const amountChanges$ = this.withdrawForm.get('amount').valueChanges.pipe(startWith(0), distinctUntilChanged());

    combineLatest([coinChanges$, amountChanges$])
      .pipe(
        takeUntil(this.onDestroy$),
        switchMap(([coin, amount]) => this.withdrawService.getWithdrawFee(coin.key, amount)),
      )
      .subscribe((fee) => {
        this.transactionFee = fee;
      });

    combineLatest([addressChanges$, coinChanges$])
      .pipe(
        takeUntil(this.onDestroy$),
        skip(2),
        switchMap(([address, coin]) => this.getHistory(address, coin, params)),
      )
      .subscribe((res) => {
        console.log(res);
        this.withdraws = res;
      });
  }

  getHistory(address, coin, qParams): Observable<IApiResponse<IWithdrawItem>> {
    return this.withdrawService.getWithdrawHistory({address: address.address, coin: coin && coin.key, ...qParams});
  }

  selectPopular(coin: ICoin): void {
    this.withdrawForm.get('coinSelect').patchValue(coin);
  }

  sort(field: 'date' | 'amount' | 'status'): void {
  }

  submitWithdraw(): void {
    this.withdrawService.sendWithdraw(this.withdrawForm.value)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
      });
  }

  addressManagement(): void {
    this.router.navigateByUrl(`profile/security/address`);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
