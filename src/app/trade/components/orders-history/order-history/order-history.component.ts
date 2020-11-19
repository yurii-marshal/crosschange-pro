import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { IOrderHistoryData } from '../../../../core/interfaces/order-history.interface';
import { takeUntil } from 'rxjs/operators';
import { TradeService } from '../../../services/trade.service';
import { IApiResponse } from 'shared-kuailian-lib';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'date',
    'pair',
    'type',
    'side',
    'average',
    'executed',
    'amount',
    'total',
    'trigger_condition',
    'action',
  ];

  dataSource$: BehaviorSubject<MatTableDataSource<IOrderHistoryData>> = new BehaviorSubject(new MatTableDataSource([]));

  onDestroyed$: Subject<void> = new Subject<void>();

  constructor(private tradeService: TradeService) { }

  ngOnInit(): void {
    this.tradeService.getOrderHistory()
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((v: IApiResponse<IOrderHistoryData>) => {
        this.dataSource$.next(new MatTableDataSource<IOrderHistoryData>(v.results));
      });
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

}
