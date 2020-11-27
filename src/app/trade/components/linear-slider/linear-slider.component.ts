import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-linear-slider',
  templateUrl: './linear-slider.component.html',
  styleUrls: ['./linear-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LinearSliderComponent),
      multi: true
    }
  ]
})
export class LinearSliderComponent implements ControlValueAccessor {
  @Input() classList: string[];
  percentageCss = 'val-0';

  ratio$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  disabled = false;
  max = 100;
  min = 0;
  step = 1;
  thumbLabel = true;
  tickInterval = 1;

  onChange = (ratio: number) => {
  }
  onTouched = () => {
  }

  constructor() {
  }

  registerOnChange(fn: (ratio: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(ratio: number): void {
    this.changeCssPercentage(ratio || 0);
    this.ratio$.next(ratio || 0);
  }

  onChangeVal(e): void {
    this.changeCssPercentage(e.value);
    this.ratio$.next(e.value);
    this.onChange(e.value);
  }

  private changeCssPercentage(val: number): void {
    if (val >= 0 && val < 25) {
      val = 0;
    } else if (val >= 25 && val < 50) {
      val = 25;
    } else if (val >= 50 && val < 75) {
      val = 50;
    } else if (val >= 75 && val < 100) {
      val = 75;
    } else {
      val = 100;
    }
    this.percentageCss = 'val-' + val;
  }
}
