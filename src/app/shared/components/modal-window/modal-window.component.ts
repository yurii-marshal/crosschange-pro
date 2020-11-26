import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ThemeSettingsService } from '../../../trade/services/theme-settings.service';

@Component({
  selector: 'app-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.scss']
})
export class ModalWindowComponent implements OnInit {
  @Input() headerText;
  @Input() draggableWindow = true;
  @Input() resizableWindow = true;

  @Output() dragEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() resizeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  fullScreen = false;

  constructor(public themeSettingsService: ThemeSettingsService) {
  }

  ngOnInit(): void {
  }

  dragWindow(): void {
    this.dragEvent.emit();
  }

  resizeWindow(): void {
    this.fullScreen = !this.fullScreen;
    this.resizeEvent.emit(this.fullScreen);
  }

}
