import { Directive, ElementRef, OnInit, Input, Optional, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/** @deprecated Do not use this without strong need */
@Directive({
  selector: '[appResizable]'
})

export class ResizableDirective implements OnInit, OnDestroy {
  @Input() resizableGrabXWidth = 4;
  @Input() resizableGrabYWidth = 4;
  @Input() resizableMinWidth = 200;
  // TODO
  @Input() resizableMaxWidth = 400;
  @Input() resizableMinHeight = 100;
  @Input() resizableMaxHeight = 500;

  dragging = false;

  private mouseMoveG: (event: any) => void;
  private mouseUpG: (event: any) => void;
  private mouseDown: (event: any) => void;
  private mouseMove: (event: any) => void;

  constructor(
    private el: ElementRef,
    @Optional() @Inject(DOCUMENT) private document: any,
  ) {

    const self = this;

    const EventListenerMode = {capture: true};

    function preventGlobalMouseEvents(): void {
      this.document.body.style['pointer-events'] = 'none';
    }

    function restoreGlobalMouseEvents(): void {
      this.document.body.style['pointer-events'] = 'auto';
    }

    const newWidth = (wid) => {
      // tslint:disable-next-line
      const newWidth = Math.max(this.resizableMinWidth, wid);
      this.el.nativeElement.style.width = (newWidth) + 'px';
    };

    const dragMoveG = (evt) => {
      if (!this.dragging) {
        return;
      }
      // tslint:disable-next-line
      const newWidth = Math.max(this.resizableMinWidth, (evt.clientX - this.el.nativeElement.offsetLeft)) + 'px';
      this.el.nativeElement.style.width = (evt.clientX - this.el.nativeElement.offsetLeft) + 'px';
      evt.stopPropagation();
    };

    this.mouseMoveG = (evt) => {
      if (!this.dragging) {
        return;
      }
      newWidth(evt.clientX - this.el.nativeElement.offsetLeft);
      evt.stopPropagation();
    };

    this.mouseUpG = (evt) => {
      if (!this.dragging) {
        return;
      }
      restoreGlobalMouseEvents();
      this.dragging = false;
      evt.stopPropagation();
    };

    this.mouseDown = (evt) => {
      if (this.inDragRegion(evt)) {
        this.dragging = true;
        preventGlobalMouseEvents();
        evt.stopPropagation();
      }
    };

    this.mouseMove = (evt) => {
      if (this.inDragRegion(evt) || this.dragging) {
        this.el.nativeElement.style.cursor = 'col-resize';
      } else {
        this.el.nativeElement.style.cursor = 'default';
      }
    };

    this.document.addEventListener('mousemove', this.mouseMoveG, true);
    this.document.addEventListener('mouseup', this.mouseUpG, true);
    this.el.nativeElement.addEventListener('mousedown', this.mouseDown, true);
    this.el.nativeElement.addEventListener('mousemove', this.mouseMove, true);
  }

  ngOnInit(): void {
    this.el.nativeElement.style['border-top'] = this.resizableGrabYWidth + 'px solid transparent';
    this.el.nativeElement.style['border-right'] = this.resizableGrabXWidth + 'px solid transparent';
  }

  ngOnDestroy(): void {
    this.document.removeEventListener('mousemove', this.mouseMoveG, true);
    this.document.removeEventListener('mouseup', this.mouseUpG, true);
    this.el.nativeElement.removeEventListener('mousedown', this.mouseDown, true);
    this.el.nativeElement.removeEventListener('mousemove', this.mouseMove, true);
  }

  inDragRegion(evt): boolean {
    return this.el.nativeElement.clientWidth - evt.clientX + this.el.nativeElement.offsetLeft < this.resizableGrabXWidth;
  }

}
