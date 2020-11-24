import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TradeService } from '../../services/trade.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService } from 'shared-kuailian-lib';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export enum IExchangeOrder {
  StopLimit = 'StopLimit',
  Market = 'Market',
  Limit = 'Limit',
  TriggerOrder = 'Trigger Order',
}

export enum ITradeType {
  Buy = 'Buy',
  Sell = 'Sell',
}

@Component({
  selector: 'app-exchange-order',
  templateUrl: './exchange-order.component.html',
  styleUrls: ['./exchange-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeOrderComponent implements OnInit, OnDestroy {
  activeTab: IExchangeOrder = IExchangeOrder.StopLimit;
  IExchangeOrder = IExchangeOrder;
  ITradeType = ITradeType;

  user: boolean;
  currentPair: string;
  triggerOrder: boolean;

  totalAmountBuy = 0;
  totalAmountSell = 0;

  stopLimitBuyForm: FormGroup;
  marketBuyForm: FormGroup;
  limitBuyForm: FormGroup;
  triggerOrderBuyForm: FormGroup;

  stopLimitSellForm: FormGroup;
  marketSellForm: FormGroup;
  limitSellForm: FormGroup;
  triggerOrderSellForm: FormGroup;

  onDestroy$: Subject<void> = new Subject<void>();

  amountTypes: string[] = [
    'amount',
    'total',
  ];

  constructor(
    private route: ActivatedRoute,
    private tradeService: TradeService,
    private sessionService: SessionService,
    private fb: FormBuilder,
  ) {
  }

  get stopLimitForm(): FormGroup {
    return this.fb.group({
      stop: ['', [Validators.required]],
      limit: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      ratio: [0],
      total: ['', [Validators.required]],
    });
  }

  get marketForm(): FormGroup {
    return this.fb.group({
      limit: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      amountType: ['amount', [Validators.required]],
      ratio: [0],
    });
  }

  get limitForm(): FormGroup {
    return this.fb.group({
      price: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      ratio: [0],
    });
  }

  get triggerOrderForm(): FormGroup {
    return this.fb.group({
      stop: ['', [Validators.required]],
      price: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      ratio: [0],
      total: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.currentPair = this.route.snapshot.queryParams.pair;
    this.user = !this.sessionService.isAuthenticated;

    this.stopLimitBuyForm = this.stopLimitForm;
    this.marketBuyForm = this.marketForm;
    this.limitBuyForm = this.limitForm;
    this.triggerOrderBuyForm = this.triggerOrderForm;

    this.stopLimitSellForm = this.stopLimitForm;
    this.marketSellForm = this.marketForm;
    this.limitSellForm = this.limitForm;
    this.triggerOrderSellForm = this.triggerOrderForm;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  switchTab(orderType: IExchangeOrder): void {
    this.activeTab = orderType;
  }

  exchange(tradeType: ITradeType, orderType: IExchangeOrder): void {
    this.tradeService.exchangeOrder({})
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
      });
  }

}

_([
  'exchange_order.amount',
  'exchange_order.total',
]);
