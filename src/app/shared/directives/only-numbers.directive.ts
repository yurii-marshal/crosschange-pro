import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName][appOnlyNumbers]'
})
export class OnlyNumbersDirective {
  private previousValue = '';

  constructor(
    private elRef: ElementRef,
    private control: NgControl,
  ) {
  }

  @HostListener('input', ['$event']) onInputChange(event): void {
    const initialValue = this.elRef.nativeElement.value;
    const pattern = /^[0-9]*\.?[0-9]*$/;

    this.control.control.patchValue(initialValue.match(pattern) ? initialValue : this.previousValue);

    this.previousValue = this.control.control.value.slice();

    if (initialValue !== this.control.control.value) {
      event.stopPropagation();
    }
  }

}
