import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { IExchangeData } from '../../interfaces/exchange-data.interface';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetComponent implements OnInit, OnChanges {
  @Input() widgetInfo: IExchangeData;
  colorScheme = {
    domain: [],
  };
  currencyType: any;

  option = {
    responsive: true,
    tooltip: {
      show: false
    },
    grid: {
      left: '5px', // Distance between grid component and the left side of the container.
      right: '5px',
      bottom: '5px',
      top: '5px'
    },
    xAxis: {
      boundaryGap: false,
      data: [],
      show: false,
      offset: 0,
      min: 'dataMin',
      max: 'dataMax'
    },
    yAxis: {
      type: 'value',
      scale: 1,
      show: false,
      offset: 0,
      min: 'dataMin',
      max: 'dataMax'
    },
    series: [],
    color: ['#52C676']
  };

  constructor() { }

  ngOnInit(): void {
    // https://www.npmjs.com/package/ngx-echarts
    // https://echarts.apache.org/examples/en/index.html#chart-type-line
    // https://echarts.apache.org/en/option.html#title
    this.currencyType = this.widgetInfo.exchange_type.split('/')[0].toLocaleLowerCase();

    this.option.color = [+this.widgetInfo.change_perce_24 >= 0 ? '#52C676' : '#DB1C27'];
    this.option.series = [{
      data: this.widgetInfo.prices,
      type: 'line',
      stack: 'counts',
      smooth: true,
      symbol: 'none'
    }];
    /*this.option.yAxis['min'] = Math.min(...this.widgetInfo.prices);*/
    this.option.xAxis.data = new Array(this.widgetInfo.prices.length).fill(1).map((v, i) => i + '');

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.widgetInfo && changes.widgetInfo.currentValue) {
      this.option.color = [+this.widgetInfo.change_perce_24 >= 0 ? '#52C676' : '#DB1C27'];
    }
  }

}
