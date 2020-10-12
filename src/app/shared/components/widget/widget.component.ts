import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IExchangeData } from '../../interfaces/exchange-data.interface';
import * as d3Shape from 'd3-shape';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetComponent implements OnInit {
  @Input() widgetInfo: IExchangeData;
  @ViewChild('chart') chartContainer;
  chartData = {};
  colorScheme = {
    domain: [],
  };

  get d3(): any {
    return d3Shape;
  }
  constructor() {
  }

  ngOnInit(): void {
    // https://swimlane.gitbook.io/ngx-charts/examples/line-area-charts/line-chart
    // https://swimlane.github.io/ngx-charts/#/ngx-charts/line-chart
    // curve: https://github.com/d3/d3-shape#curves

    const color = this.isPositiveChange() ? '#52C676' : '#DB1C27';
    this.colorScheme.domain.push(color);
    const series = this.widgetInfo.prices.map(((v, i) => {
      return { name: i + '', value: v || 0 };
    })) || [];
    this.chartData = [
      {
        name: this.widgetInfo.exchange_type,
        series
      }
    ];
  }



  isPositiveChange(): boolean {
    return +this.widgetInfo.change_perce_24 >= 0;
  }
}
