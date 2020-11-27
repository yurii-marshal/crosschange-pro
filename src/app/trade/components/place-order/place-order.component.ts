import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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

  totalAmountBuy = 1000;
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
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.currentPair = this.router.url.split('/').pop();
    this.user = this.sessionService.isAuthenticated;

    this.buyForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0), Validators.max(this.totalAmountBuy)]],
      amountSlider: [],
    });

    this.sellForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0), Validators.max(this.totalAmountSell)]],
      amountSlider: [],
    });

    this.setAmountListener(this.buyForm, 'buy');
    this.setAmountListener(this.sellForm, 'sell');

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

  private setAmountListener(form, type: 'buy' | 'sell'): void {
    form.get('amount').valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        distinctUntilChanged(),
      )
      .subscribe((v: number) => {
        const total = type === 'buy' ? this.totalAmountBuy : this.totalAmountSell;
        let val;

        if (!v) {
          val = 0;
        } else {
          val = total > 0 ? (v / total) * 100 : 100;
        }

        form.get('amountSlider').patchValue(val, {emitEvent: false});
      });
    form.get('amountSlider').valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        distinctUntilChanged(),
      )
      .subscribe((v: number) => {
        const total = type === 'buy' ? this.totalAmountBuy : this.totalAmountSell;
        const val = v > 0 ? total * (v / 100) : 0;
        form.get('amount').patchValue(val, {emitEvent: false});
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
