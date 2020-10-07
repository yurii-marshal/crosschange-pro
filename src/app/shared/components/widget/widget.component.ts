import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IExchangeData } from '../../interfaces/exchange-data.interface';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetComponent {
  @Input() widgetInfo: IExchangeData;

  constructor() { }

  isPositiveChange(): boolean {
    return +this.widgetInfo.change_perce_24 >= 0;
  }
}
