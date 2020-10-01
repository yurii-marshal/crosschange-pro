import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  Placement,
  PopoverHorizontalAlign,
  PopoverScrollStrategy,
  PopoverVerticalAlign,
  VALID_HORIZ_ALIGN,
  VALID_PLACEMENT,
  VALID_SCROLL,
  VALID_VERT_ALIGN,
} from '../types';
import {
  NotificationAction,
  PopoverNotification,
  PopoverNotificationService,
} from '../notification.service';
import { popoverAnimations, PopoverAnimationState } from '../popover-amination';

function getUnanchoredPopoverError(): Error {
  return Error('appPopover is not anchored to any appPopoverAnchor.');
}

function getInvalidPlacementError(alignment): Error {
  return Error(generateGenericError('placement', alignment, VALID_PLACEMENT));
}

function getInvalidHorizontalAlignError(alignment): Error {
  return Error(generateGenericError('horizontalAlign', alignment, VALID_HORIZ_ALIGN));
}

function getInvalidVerticalAlignError(alignment): Error {
  return Error(generateGenericError('verticalAlign', alignment, VALID_VERT_ALIGN));
}

function getInvalidScrollStrategyError(strategy): Error {
  return Error(generateGenericError('scrollStrategy', strategy, VALID_SCROLL));
}

function generateGenericError(apiName: string, invalid: any, valid: string[]): string {
  return `Invalid ${apiName}: '${invalid}'. Valid options are ` +
    `${valid.map(v => `'${v}'`).join(', ')}.`;
}

@Component({
  selector: 'app-popover-template',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./popover-flexible-template.component.scss'],
  templateUrl: './popover-flexible-template.component.html',
  animations: [popoverAnimations.rotatePopover],
})
export class PopoverFlexibleTemplateComponent implements OnInit, OnDestroy {
  /** Optional backdrop class. */
  @Input() backdropClass = '';
  /** Optional panel class. */
  @Input() panelClass = '';
  /** Emits when the popover is opened. */
  @Output() opened = new EventEmitter<void>();
  /** Emits when the popover is closed. */
  @Output() closed = new EventEmitter<any>();
  /** Emits when the popover has finished opening. */
  @Output() afterOpen = new EventEmitter<void>();
  /** Emits when the popover has finished closing. */
  @Output() afterClose = new EventEmitter<void>();
  /** Emits when the backdrop is clicked. */
  @Output() backdropClicked = new EventEmitter<void>();
  /** Emits when a keydown event is targeted to this popover's overlay. */
  @Output() overlayKeydown = new EventEmitter<KeyboardEvent>();
  /** Reference to template so it can be placed within a portal. */
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
  /** Classes to be added to the popover for setting the correct transform origin. */
  classList: any = {};
  /** Whether the popover is presently open. */
  isOpened = false;
  /** Instance of notification service. Will be undefined until attached to an anchor. */
  notifications: PopoverNotificationService;
  animationState: PopoverAnimationState = 'default';
  /** Reference to the element to build a focus trap around. */
  @ViewChild('focusTrapElement')
  private focusTrapElement: ElementRef;
  private popoverHorizontalAlign: PopoverHorizontalAlign = 'center';
  private popoverVerticalAlign: PopoverVerticalAlign = 'bottom';
  private popoverPlacement: Placement = 'bottom';
  private popoverForceAlignment = false;
  private popoverLockAlignment = true;
  private popoverScrollStrategy: PopoverScrollStrategy = 'reposition';
  private popoverHasBackdrop = false;

  constructor(@Optional() @Inject(DOCUMENT) private document: any) {
  }

  /** Alignment of the popover on the horizontal axis. */
  get horizontalAlign(): PopoverHorizontalAlign {
    return this.popoverHorizontalAlign;
  }

  set horizontalAlign(val: PopoverHorizontalAlign) {
    this.validateHorizontalAlign(val);
    if (this.popoverHorizontalAlign !== val) {
      this.popoverHorizontalAlign = val;
      this.dispatchConfigNotification(new PopoverNotification(NotificationAction.REPOSITION));
    }
  }

  /** Alignment of the popover on the vertical axis. */
  get verticalAlign(): PopoverVerticalAlign {
    return this.popoverVerticalAlign;
  }

  set verticalAlign(val: PopoverVerticalAlign) {
    this.validateVerticalAlign(val);
    if (this.popoverVerticalAlign !== val) {
      this.popoverVerticalAlign = val;
      this.dispatchConfigNotification(new PopoverNotification(NotificationAction.REPOSITION));
    }
  }

  /** Placement of the popover as alternative way to set the position. */
  @Input()
  get placement(): Placement {
    return this.popoverPlacement;
  }

  set placement(val: Placement) {
    this.validatePlacement(val);
    if (this.popoverPlacement !== val) {
      this.popoverPlacement = val;
      this.dispatchConfigNotification(new PopoverNotification(NotificationAction.REPOSITION));
    }
  }

  /** Whether the popover always opens with the specified alignment. */
  @Input()
  get forceAlignment(): boolean {
    return this.popoverForceAlignment;
  }

  set forceAlignment(val: boolean) {
    if (this.forceAlignment !== val) {
      this.popoverForceAlignment = val;
      this.dispatchConfigNotification(new PopoverNotification(NotificationAction.REPOSITION));
    }
  }

  /**
   * Whether the popover's alignment is locked after opening. This prevents the popover
   * from changing its alignement when scrolling or changing the size of the viewport.
   */
  @Input()
  get lockAlignment(): boolean {
    return this.popoverLockAlignment;
  }

  set lockAlignment(val: boolean) {
    if (this.popoverLockAlignment !== val) {
      this.popoverLockAlignment = val;
      this.dispatchConfigNotification(new PopoverNotification(NotificationAction.REPOSITION));
    }
  }

  /** How the popover should handle scrolling. */
  @Input()
  get scrollStrategy(): PopoverScrollStrategy {
    return this.popoverScrollStrategy;
  }

  set scrollStrategy(val: PopoverScrollStrategy) {
    this.validateScrollStrategy(val);
    if (this.popoverScrollStrategy !== val) {
      this.popoverScrollStrategy = val;
      this.dispatchConfigNotification(new PopoverNotification(NotificationAction.UPDATE_CONFIG));
    }
  }

  /** Whether the popover should have a backdrop (includes closing on click by default). */
  @Input()
  get hasBackdrop(): boolean {
    return this.popoverHasBackdrop;
  }

  set hasBackdrop(val: boolean) {
    this.popoverHasBackdrop = val;
  }

  ngOnInit(): void {
    this.setAlignmentPlaces();
    this.setAlignmentClasses();
  }

  ngOnDestroy(): void {
    if (this.notifications) {
      this.notifications.dispose();
    }
  }

  /** Open this popover. */
  open(): void {
    this.isOpened = true;
    this.animationState = 'default';

    const notification = new PopoverNotification(NotificationAction.OPEN);
    this.dispatchActionNotification(notification);
  }

  /** Close this popover. */
  close(): void {
    this.isOpened = false;
    this.animationState = 'closing';
  }

  onRotateFinished(event: any): void {
    const {toState} = event;
    const isFadeOut = (toState as PopoverAnimationState) === 'closing';
    const itFinished = this.animationState === 'closing';

    if (isFadeOut && itFinished) {
      const notification = new PopoverNotification(NotificationAction.CLOSE);
      this.dispatchActionNotification(notification);
    }
  }

  /** Toggle this popover open or closed. */
  toggle(): void {
    this.isOpened = !this.isOpened;
    this.animationState = this.isOpened ? 'default' : 'closing';

    const notification = new PopoverNotification(NotificationAction.TOGGLE);
    this.dispatchActionNotification(notification);
  }

  /** Realign the popover to the anchor. */
  realign(): void {
    const notification = new PopoverNotification(NotificationAction.REALIGN);
    this.dispatchActionNotification(notification);
  }

  /** Reduce placement aliases due to needs of CDK Portal */
  setAlignmentPlaces(): void {
    switch (this.placement) {
      case 'top':
        this.horizontalAlign = 'center';
        this.verticalAlign = 'top';
        break;
      case 'top-left':
        this.horizontalAlign = 'start';
        this.verticalAlign = 'top';
        break;
      case 'top-right':
        this.horizontalAlign = 'end';
        this.verticalAlign = 'top';
        break;
      case 'bottom':
        this.horizontalAlign = 'center';
        this.verticalAlign = 'bottom';
        break;
      case 'bottom-left':
        this.horizontalAlign = 'start';
        this.verticalAlign = 'bottom';
        break;
      case 'bottom-right':
        this.horizontalAlign = 'end';
        this.verticalAlign = 'bottom';
        break;
      case 'left':
        this.horizontalAlign = 'left';
        this.verticalAlign = 'center';
        break;
      case 'left-top':
        this.horizontalAlign = 'left';
        this.verticalAlign = 'start';
        break;
      case 'left-bottom':
        this.horizontalAlign = 'left';
        this.verticalAlign = 'end';
        break;
      case 'right':
        this.horizontalAlign = 'right';
        this.verticalAlign = 'center';
        break;
      case 'right-top':
        this.horizontalAlign = 'right';
        this.verticalAlign = 'start';
        break;
      case 'right-bottom':
        this.horizontalAlign = 'right';
        this.verticalAlign = 'end';
        break;
    }
  }

  /** Apply alignment classes based on alignment inputs. */
  setAlignmentClasses(hAlign = this.horizontalAlign, vAlign = this.verticalAlign): void {

    let placement = this.placement.slice();

    // in the case if popover applies realign
    switch (hAlign) {
      case 'right':
        if (placement.startsWith('left')) {
          placement = placement.replace('left', 'right');
        }
        break;
      case 'left':
        if (placement.startsWith('right')) {
          placement = placement.replace('right', 'left');
        }
        break;
    }

    switch (vAlign) {
      case 'top':
        if (placement.startsWith('bottom')) {
          placement = placement.replace('bottom', 'top');
        }
        break;
      case 'bottom':
        if (placement.startsWith('top')) {
          placement = placement.replace('top', 'bottom');
        }
        break;
    }

    this.classList['v-top'] = placement === 'top' || placement === 'top-left' || placement === 'top-right';

    this.classList['v-start'] = placement === 'left-top' || placement === 'right-top';

    this.classList['v-center'] = placement === 'left' || placement === 'right';

    this.classList['v-end'] = placement === 'left-bottom' || placement === 'right-bottom';

    this.classList['v-bottom'] = placement === 'bottom' || placement === 'bottom-left' || placement === 'bottom-right';

    this.classList['h-left'] = placement === 'left' || placement === 'left-top' || placement === 'left-bottom';

    this.classList['h-start'] = placement === 'top-left' || placement === 'bottom-left';

    this.classList['h-center'] = placement === 'top' || placement === 'bottom';

    this.classList['h-end'] = placement === 'top-right' || placement === 'bottom-right';

    this.classList['h-right'] = placement === 'right' || placement === 'right-top' || placement === 'right-bottom';

    this.classList['is-open'] = this.isOpened;
  }

  /** Dispatch a notification to the notification service, if possible. */
  private dispatchConfigNotification(notification: PopoverNotification): void {
    if (this.notifications) {
      this.notifications.dispatch(notification);
    }
  }

  /** Dispatch a notification to the notification service and throw if unable to. */
  private dispatchActionNotification(notification: PopoverNotification): void {
    if (!this.notifications) {
      throw getUnanchoredPopoverError();
    }

    this.notifications.dispatch(notification);
  }

  /** Throws an error if the alignment is not a valid placement. */
  private validatePlacement(pos: Placement): void {
    if (VALID_PLACEMENT.indexOf(pos) === -1) {
      throw getInvalidPlacementError(pos);
    }
  }

  /** Throws an error if the alignment is not a valid horizontalAlign. */
  private validateHorizontalAlign(pos: PopoverHorizontalAlign): void {
    if (VALID_HORIZ_ALIGN.indexOf(pos) === -1) {
      throw getInvalidHorizontalAlignError(pos);
    }
  }

  /** Throws an error if the alignment is not a valid verticalAlign. */
  private validateVerticalAlign(pos: PopoverVerticalAlign): void {
    if (VALID_VERT_ALIGN.indexOf(pos) === -1) {
      throw getInvalidVerticalAlignError(pos);
    }
  }

  /** Throws an error if the scroll strategy is not a valid strategy. */
  private validateScrollStrategy(strategy: PopoverScrollStrategy): void {
    if (VALID_SCROLL.indexOf(strategy) === -1) {
      throw getInvalidScrollStrategyError(strategy);
    }
  }

}
