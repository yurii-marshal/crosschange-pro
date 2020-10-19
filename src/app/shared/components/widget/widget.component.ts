import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { IExchangeData } from '../../interfaces/exchange-data.interface';
import * as d3Shape from 'd3-shape';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetComponent implements OnInit, OnChanges {
  @Input() widgetInfo: IExchangeData;
  chartData: {
    name: string,
    series: { name: string, value: number }[]
  }[] = [];
  colorScheme = {
    domain: [],
  };
  currencyType: any;

  constructor() { }

  get d3(): any {
    return d3Shape;
  }

  ngOnInit(): void {
    // https://swimlane.gitbook.io/ngx-charts/examples/line-area-charts/line-chart
    // https://swimlane.github.io/ngx-charts/#/ngx-charts/line-chart
    // curve: https://github.com/d3/d3-shape#curves
    this.currencyType = this.widgetInfo.exchange_type.split('/')[0].toLocaleLowerCase();
    this.colorScheme.domain = [+this.widgetInfo.change_percent_24 >= 0 ? '#52C676' : '#DB1C27'];
    const series = this.widgetInfo.prices.map(((v, i) => {
      return { name: i + '', value: v || 0 };
    })) || [];
    this.chartData = [
      {
        name: '',
        series
      }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.widgetInfo && changes.widgetInfo.currentValue) {
      this.colorScheme.domain = [+changes.widgetInfo.currentValue.change_percent_24 >= 0 ? '#52C676' : '#DB1C27'];
    }
  }

}
