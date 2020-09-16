import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IWidget } from "src/app/shared/interfaces/widget.interface";
import { Observable, Subject } from "rxjs";
import { MarketsService } from "src/app/home/services/markets.service";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketsComponent implements OnInit {
  widgets: Observable<IWidget[]>;
  onDestroy$: Subject<void> = new Subject<void>();

  constructor(private marketsService: MarketsService) { }

  ngOnInit(): void {
    this.widgets = this.marketsService.getWidgetsData().pipe(
      takeUntil(this.onDestroy$)
    );
  }

  ngOnDestroy():void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
