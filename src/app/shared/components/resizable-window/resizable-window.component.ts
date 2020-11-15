import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-resizable-window',
  templateUrl: './resizable-window.component.html',
  styleUrls: ['./resizable-window.component.scss']
})
export class ResizableWindowComponent {
  @Input() headerText = '';
  @Input() draggableWindow = true;
  @Input() resizableWindow = true;

  @Output() dragEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() resizeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  fullScreen = false;

  constructor() {
  }

  dragWindow(): void {
    this.dragEvent.emit();
  }

  resizeWindow(): void {
    this.fullScreen = !this.fullScreen;
    this.resizeEvent.emit(this.fullScreen);
  }

}
