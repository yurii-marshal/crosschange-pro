import { ChangeDetectionStrategy, Component, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

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
export class LinearSliderComponent implements OnInit {
  disabled = false;
  max = 100;
  min = 0;
  step = 1;
  thumbLabel = true;
  tickInterval = 1;

  ratio$: ReplaySubject<number> = new ReplaySubject(0);

  onChange = (ratio: number) => {
  }
  onTouched = () => {
  }

  constructor() {
  }

  ngOnInit(): void {
    this.ratio$.asObservable()
      .pipe(map((val: number) => this.writeValue(val)));
  }

  registerOnChange(fn: (ratio: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(ratio: number): void {
    if (!ratio) {
      return;
    }

    this.onChange(ratio);
  }

}
