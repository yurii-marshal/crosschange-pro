import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
  ViewContainerRef
} from '@angular/core';
import { Subject, merge } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { PopoverService } from './popover.service';
import { PopoverFlexibleTemplateComponent } from './popover-flexible-template/popover-flexible-template.component';

function getInvalidPopoverError(): Error {
  return Error('PopoverAnchor must be provided as Popover component instance.');
}

@Directive({
  selector: '[appPopover]',
  exportAs: 'appPopoverAnchor',
  providers: [PopoverService],
})
export class PopoverAnchorDirective implements OnInit, OnDestroy {

  /** Emits when the popover is opened. */
  @Output() popoverOpened = new EventEmitter<void>();
  /** Emits when the popover is closed. */
  @Output() popoverClosed = new EventEmitter<any>();
  /** Emits when the directive is destroyed. */
  private onDestroy = new Subject<void>();

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    public popoverService: PopoverService,
  ) {
  }

  private attachedPopoverComponent: PopoverFlexibleTemplateComponent;

  /** Reference to the popover instance. */
  @Input('appPopover')
  get attachedPopover(): PopoverFlexibleTemplateComponent {
    return this.attachedPopoverComponent;
  }

  set attachedPopover(value: PopoverFlexibleTemplateComponent) {
    this.validateAttachedPopover(value);
    this.attachedPopoverComponent = value;
    // Anchor the popover to the element ref
    this.popoverService.anchor(this.attachedPopover, this.viewContainerRef, this.elementRef);
  }

  ngOnInit(): void {
    // Re-emit open and close events
    const opened$ = this.popoverService.popoverOpened
      .pipe(tap(() => this.popoverOpened.emit()));
    const closed$ = this.popoverService.popoverClosed
      .pipe(tap(value => this.popoverClosed.emit(value)));
    merge(opened$, closed$).pipe(takeUntil(this.onDestroy)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /** Gets whether the popover is presently open. */
  isPopoverOpen(): boolean {
    return this.popoverService.isPopoverOpen();
  }

  /** Toggles the popover between the open and closed states. */
  togglePopover(): void {
    this.popoverService.togglePopover();
  }

  /** Opens the popover. */
  openPopover(): void {
    this.popoverService.openPopover();
  }

  /** Closes the popover. */
  closePopover(value?: any): void {
    this.popoverService.closePopover(value);
  }

  /** Realign the popover to the anchor. */
  realignPopover(): void {
    this.popoverService.realignPopoverToAnchor();
  }

  /** Get a reference to the anchor element. */
  getElement(): ElementRef {
    return this.elementRef;
  }

  /** Throws an error if the popover instance is not provided. */
  private validateAttachedPopover(popover: PopoverFlexibleTemplateComponent): void {
    if (!popover || !(popover instanceof PopoverFlexibleTemplateComponent)) {
      throw getInvalidPopoverError();
    }
  }
}
