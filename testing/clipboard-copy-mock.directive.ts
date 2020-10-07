import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[cbContent]'
})
export class ClipboardCopyMockDirective {
  @Input('cbContent') content: string;

  @HostListener('click', ['$event.target']) onClick(target): void {
    target.setAttribute('clipboard-content', this.content);
  }

  constructor(el: ElementRef) {}
}
