import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IExchangeData } from '../../interfaces/exchange-data.interface';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetComponent implements OnInit {
  @Input() widgetInfo: IExchangeData;

  currencyType: any;

  constructor() { }

  ngOnInit(): void {
    this.currencyType = this.widgetInfo.exchange_type.split('/')[0].toLocaleLowerCase();
  }

  isPositiveChange(): boolean {
    return +this.widgetInfo.change_perce_24 >= 0;
  }
}
