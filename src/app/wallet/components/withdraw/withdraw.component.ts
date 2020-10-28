import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICoin } from '../../../shared/interfaces/coin.interface';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CoinsService } from '../../../shared/services/coins.service';
import { IApiResponse } from 'shared-kuailian-lib';
import { IWithdrawItem } from '../../../shared/interfaces/withdraw-item.interface';
import {
  debounceTime,
  distinctUntilChanged,
  shareReplay,
  startWith,
  switchMap,
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
export class WithdrawComponent implements OnInit {
  coinSelect$: BehaviorSubject<ICoin> = new BehaviorSubject<ICoin>(null);
  addressSelect$: Subject<IAddress> = new Subject<IAddress>();
  transactionFee$: Observable<number>;
  popular$: Observable<ICoin[]>;
  wallets$: Observable<IWallet[]>;
  addresses$: Observable<IAddress[]>;
  withdraws$: Observable<IApiResponse<IWithdrawItem>>;

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

    const addressChanges$ = this.addressSelect$.asObservable().pipe(distinctUntilChanged());
    const coinChanges$ = this.coinSelect$.asObservable().pipe(distinctUntilChanged());
    const amountChanges$ = this.withdrawForm.get('amount').valueChanges.pipe(startWith(0), distinctUntilChanged(), debounceTime(200));

    this.transactionFee$ = combineLatest([coinChanges$, addressChanges$, amountChanges$])
      .pipe(
        distinctUntilChanged(),
        switchMap(([coin, address, amount]) =>
          coin && address && amount
            ? this.withdrawService.getWithdrawFee({coin, address, amount})
            : of(0)),
        shareReplay(),
      );

    this.withdraws$ = this.withdrawService.getWithdrawHistory(params);
    // combineLatest([addressChanges$, coinChanges$])
    //   .pipe(
    //     switchMap(([address, coin]) => this.getHistory(address, coin, params)),
    //     shareReplay(),
    //   );
  }

  coinSelectChanged(coin: ICoin): void {
    this.coinSelect$.next(coin);
  }

  addressSelectChanged(address: IAddress): void {
    this.addressSelect$.next(address);
  }

  // getHistory(address, coin, qParams): Observable<IApiResponse<IWithdrawItem>> {
  //   return this.withdrawService.getWithdrawHistory({address: address.address, coin: coin && coin.key, ...qParams});
  // }

  selectPopular(coin: ICoin): void {
    this.withdrawForm.get('coinSelect').patchValue(coin);
  }

  sort(field: 'date' | 'amount' | 'status'): void {
  }

  submitWithdraw(): void {
    // this.withdrawService.sendWithdraw(this.withdrawForm.value)
    //   .pipe(takeUntil(this.onDestroy$))
    //   .subscribe(() => {
    //   });
  }

  addressManagement(): void {
    this.router.navigateByUrl(`profile/security/address`);
  }
}
