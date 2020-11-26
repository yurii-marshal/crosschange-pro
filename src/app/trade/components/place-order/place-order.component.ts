import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TradeService } from '../../services/trade.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService } from 'shared-kuailian-lib';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export enum IPlaceOrder {
  StopLimit = 'StopLimit',
  Market = 'Market',
  Limit = 'Limit',
  TriggerOrder = 'Trigger Order',
}

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceOrderComponent implements OnInit, OnDestroy {
  activeTab: IPlaceOrder = IPlaceOrder.Market;
  IPlaceOrder = IPlaceOrder;

  placeOrderBuy$: Subject<void> = new Subject<void>();
  placeOrderSell$: Subject<void> = new Subject<void>();

  user: boolean;
  currentPair: string;
  triggerOrder: boolean;

  totalAmountBuy = 0;
  totalAmountSell = 0;

  buyForm: FormGroup;
  sellForm: FormGroup;

  rangeChangeBuy: number;
  rangeChangeSell: number;
  rangeChangeBuy$: Subject<number> = new Subject<number>();
  rangeChangeSell$: Subject<number> = new Subject<number>();

  onDestroy$: Subject<void> = new Subject<void>();

  amountTypes: string[] = [
    'amount',
    'total',
  ];

  amountTypeBuy = 'amount';
  amountTypeSell = 'amount';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tradeService: TradeService,
    private sessionService: SessionService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.currentPair = this.router.url.split('/').pop();
    this.user = this.sessionService.isAuthenticated;

    this.buyForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0), Validators.max(this.totalAmountBuy)]],
    });

    this.sellForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0), Validators.max(this.totalAmountSell)]],
    });

    this.buyForm.get('amount').valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        distinctUntilChanged(),
      )
      .subscribe((v: number) => {
        this.rangeChangeBuy = this.totalAmountBuy > 0 ? (v / this.totalAmountBuy) * 100 : 100;
      });

    this.sellForm.get('amount').valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        distinctUntilChanged(),
      )
      .subscribe((v: number) => {
        this.rangeChangeSell = this.totalAmountSell > 0 ? (v / this.totalAmountSell) * 100 : 100;
      });

    this.rangeChangeBuy$.asObservable()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((v: number) => {
        const partition = v > 0 ? this.totalAmountBuy * (v / 100) : 0;
        this.buyForm.get('amount').patchValue(partition);
      });

    this.rangeChangeSell$.asObservable()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((v: number) => {
        const partition = v > 0 ? this.totalAmountSell * (v / 100) : 0;
        this.sellForm.get('amount').patchValue(partition);
      });

    this.placeOrderBuy$.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.tradeService.placeOrder({})
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => {
        });
    });

    this.placeOrderSell$.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.tradeService.placeOrder({})
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => {
        });
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  switchTab(orderType: IPlaceOrder): void {
    this.activeTab = orderType;
  }
}

_([
  'place_order.amount',
  'place_order.total',
]);
