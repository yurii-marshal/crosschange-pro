import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IWidget } from 'src/app/shared/interfaces/widget.interface';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetComponent {
  @Input() widgetInfo: IWidget;

  constructor() { }

  isPositiveChange(): boolean {
    return this.widgetInfo.change.charAt(0) === '+';
  }

}
