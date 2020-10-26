import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICoin } from '../../../shared/interfaces/coin.interface';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CoinsService } from '../../../shared/services/coins.service';
import { IApiResponse } from 'shared-kuailian-lib';
import { IWithdrawItem } from '../../../shared/interfaces/withdraw-item.interface';
import { distinctUntilChanged, map, share, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { ITransactionItem } from '../../../shared/interfaces/transaction-item.interface';
import { WithdrawService } from '../../services/withdraw.service';
import { IWallet } from '../../../shared/interfaces/wallet.interface';
import { WalletService } from '../../services/wallet.service';
import { IAddress } from '../../../shared/interfaces/address.interface';
import { AddressService } from '../../../shared/services/address.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss', './../deposit/deposit.component.scss']
})
export class WithdrawComponent implements OnInit, OnDestroy {
  transactionFee$: Observable<number>;
  selectedCoin$: BehaviorSubject<ICoin> = new BehaviorSubject<ICoin | null>(null);
  selectedAddress$: BehaviorSubject<IAddress> = new BehaviorSubject<IAddress | null>(null);
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
      this.navigateDefault();
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

    this.transactionFee$ = combineLatest([
      this.withdrawForm.get('coinSelect').valueChanges.pipe(startWith('')),
      this.withdrawForm.get('amount').valueChanges.pipe(startWith(0)),
    ])
      .pipe(
        map(([selected, amount]) => (+selected.fee * +amount) || 0),
        share(),
      );

    combineLatest([
      this.route.queryParams,
      this.selectedCoin$,
    ])
      .pipe(takeUntil(this.onDestroy$), distinctUntilChanged())
      .subscribe(([qParams, selected]) => {
        this.withdraws$ = this.getHistory(selected, qParams);
      });
  }

  getHistory(selected, qParams): Observable<IApiResponse<ITransactionItem>> {
    return this.withdrawService.getWithdrawHistory({cryptocurrency: selected && selected.key, ...qParams});
  }

  selectPopular(coin: ICoin): void {
    this.withdrawForm.get('coinSelect').setValue(coin);
  }

  onCoinSelect(coin: ICoin): void {
    this.selectedCoin$.next(coin);
    this.navigateDefault();
  }

  onAddressSelect(address: IAddress): void {
    this.selectedAddress$.next(address);
    this.navigateDefault();
  }

  navigateDefault(): void {
    this.router.navigate(
      [window.location.pathname],
      {queryParams: {offset: 0, limit: this.route.snapshot.queryParams.limit}}
    );
  }

  sort(field: 'date' | 'amount' | 'status'): void {
  }

  submitWithdraw(): void {
  }

  addressManagement(): void {
    this.router.navigateByUrl(`somewhere/address-management`);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
