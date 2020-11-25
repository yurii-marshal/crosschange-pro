import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ITheme } from '../../../trade/services/theme-settings.interface';

@Component({
  selector: 'app-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.scss']
})
export class ModalWindowComponent {
  @Input() headerText;
  @Input() theme: Observable<ITheme>;
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
