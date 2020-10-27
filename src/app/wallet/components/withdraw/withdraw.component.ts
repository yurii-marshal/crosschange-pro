import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICoin } from '../../../shared/interfaces/coin.interface';
import { combineLatest, Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CoinsService } from '../../../shared/services/coins.service';
import { IApiResponse } from 'shared-kuailian-lib';
import { IWithdrawItem } from '../../../shared/interfaces/withdraw-item.interface';
import { debounceTime, distinctUntilChanged, startWith, switchMap, take, takeUntil } from 'rxjs/operators';
import { ITransactionItem } from '../../../shared/interfaces/transaction-item.interface';
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
  transactionFee$: Observable<number>;
  popular$: Observable<ICoin[]>;
  wallets$: Observable<IWallet[]>;
  addresses$: Observable<IAddress[]>;
  withdraws$: Observable<IApiResponse<ITransactionItem>>;
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
      params.offset = defaultPagination.offset;
      params.limit = defaultPagination.limit;
    }

    this.withdrawForm = new FormGroup({
      tag: new FormControl('', []),
      amount: new FormControl('', [Validators.required]),
      coinSelect: new FormControl('', [Validators.required]),
      recipientAddressSelect: new FormControl('', [Validators.required]),
    });

    this.popular$ = this.coinsService.getPopular();
    this.wallets$ = this.walletService.getWallets();
    this.addresses$ = this.addressService.getRecipientAddresses().pipe(take(1));

    const addressChanges$ = this.withdrawForm.get('recipientAddressSelect').valueChanges.pipe(startWith(''), distinctUntilChanged());
    const coinChanges$ = this.withdrawForm.get('coinSelect').valueChanges.pipe(startWith(''), distinctUntilChanged());
    const amountChanges$ = this.withdrawForm.get('amount').valueChanges.pipe(startWith(0), debounceTime(100), distinctUntilChanged());

    this.transactionFee$ = combineLatest([
      coinChanges$,
      amountChanges$,
    ]).pipe(switchMap(([coin, amount]) => this.withdrawService.getWithdrawFee(coin.key, amount)));

    // TODO
    this.withdraws$ = combineLatest([
      addressChanges$,
      coinChanges$,
    ])
      .pipe(
        takeUntil(this.onDestroy$),
        distinctUntilChanged(),
        switchMap(([addresses, coin]) => this.getHistory(coin, params)),
      );
  }

  getHistory(selected, qParams): Observable<IApiResponse<ITransactionItem>> {
    return this.withdrawService.getWithdrawHistory({cryptocurrency: selected && selected.key, ...qParams});
  }

  selectPopular(coin: ICoin): void {
    this.withdrawForm.get('coinSelect').setValue(coin);
  }

  sort(field: 'date' | 'amount' | 'status'): void {
  }

  submitWithdraw(): void {
    this.withdrawService.sendWithdraw(this.withdrawForm.value)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {});
  }

  addressManagement(): void {
    this.router.navigateByUrl(`somewhere/address-management`);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
