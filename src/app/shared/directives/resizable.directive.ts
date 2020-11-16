import { Directive, ElementRef, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appResizable]'
})

export class ResizableDirective implements OnInit {
  @Input() resizableGrabXWidth = 4;
  @Input() resizableGrabYWidth = 4;
  @Input() resizableMinWidth = 200;
  // TODO
  @Input() resizableMaxWidth = 400;
  @Input() resizableMinHeight = 100;
  @Input() resizableMaxHeight = 500;

  dragging = false;

  constructor(private el: ElementRef) {

    const self = this;

    const EventListenerMode = {capture: true};

    function preventGlobalMouseEvents(): void {
      document.body.style['pointer-events'] = 'none';
    }

    function restoreGlobalMouseEvents(): void {
      document.body.style['pointer-events'] = 'auto';
    }

    const newWidth = (wid) => {
      // tslint:disable-next-line
      const newWidth = Math.max(this.resizableMinWidth, wid);
      el.nativeElement.style.width = (newWidth) + 'px';
    };

    const mouseMoveG = (evt) => {
      if (!this.dragging) {
        return;
      }
      newWidth(evt.clientX - el.nativeElement.offsetLeft);
      evt.stopPropagation();
    };

    const dragMoveG = (evt) => {
      if (!this.dragging) {
        return;
      }
      // tslint:disable-next-line
      const newWidth = Math.max(this.resizableMinWidth, (evt.clientX - el.nativeElement.offsetLeft)) + 'px';
      el.nativeElement.style.width = (evt.clientX - el.nativeElement.offsetLeft) + 'px';
      evt.stopPropagation();
    };

    const mouseUpG = (evt) => {
      if (!this.dragging) {
        return;
      }
      restoreGlobalMouseEvents();
      this.dragging = false;
      evt.stopPropagation();
    };

    const mouseDown = (evt) => {
      if (this.inDragRegion(evt)) {
        this.dragging = true;
        preventGlobalMouseEvents();
        evt.stopPropagation();
      }
    };

    const mouseMove = (evt) => {
      if (this.inDragRegion(evt) || this.dragging) {
        el.nativeElement.style.cursor = 'col-resize';
      } else {
        el.nativeElement.style.cursor = 'default';
      }
    };

    document.addEventListener('mousemove', mouseMoveG, true);
    document.addEventListener('mouseup', mouseUpG, true);
    el.nativeElement.addEventListener('mousedown', mouseDown, true);
    el.nativeElement.addEventListener('mousemove', mouseMove, true);
  }

  ngOnInit(): void {
    this.el.nativeElement.style['border-top'] = this.resizableGrabYWidth + 'px solid transparent';
    this.el.nativeElement.style['border-right'] = this.resizableGrabXWidth + 'px solid transparent';
  }

  inDragRegion(evt): boolean {
    return this.el.nativeElement.clientWidth - evt.clientX + this.el.nativeElement.offsetLeft < this.resizableGrabXWidth;
  }

}
