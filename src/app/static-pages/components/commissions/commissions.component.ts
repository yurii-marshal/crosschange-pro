import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ICommissionCoin, StaticPagesService } from '../../services/static-pages.service';

@Component({
  selector: 'app-commissions',
  templateUrl: './commissions.component.html',
  styleUrls: ['./commissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommissionsComponent implements OnInit {
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

}
