import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ICommissionCoin, StaticPagesService } from '../../services/static-pages.service';

@Component({
  selector: 'app-commissions',
  templateUrl: './commissions.component.html',
  styleUrls: ['./commissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommissionsComponent implements OnInit, OnDestroy {
  onDestroyed$: Subject<void> = new Subject<void>();
  displayedColumns: string[] = [
    'cryptocurrency',
    'withdraw_fee',
    'deposit_fee',
    'withdrawal_minimum',
  ];
  dataSource$: BehaviorSubject<MatTableDataSource<ICommissionCoin>> = new BehaviorSubject(new MatTableDataSource([]));

  constructor(
    private staticPagesService: StaticPagesService
  ) { }

  ngOnInit(): void {

    this.staticPagesService.getCommissionsData().subscribe(v => {
      this.dataSource$.next(new MatTableDataSource<ICommissionCoin>(v));
    });
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

}
