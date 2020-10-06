import {
  Injectable,
  Injector,
  Inject,
  ElementRef,
  OnDestroy,
  ViewContainerRef,
  NgZone,
} from '@angular/core';
import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  GlobalPositionStrategy,
  HorizontalConnectionPos,
  Overlay,
  OverlayConfig,
  OverlayRef,
  ScrollStrategy,
  VerticalConnectionPos,
} from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector, TemplatePortal } from '@angular/cdk/portal';

import { PopoverGlobalTemplateComponent } from './popover-global-template/popover-global-template.component';
import {
  PopoverData,
  POPOVER_CONFIG_TOKEN,
  PopoverConfig,
  defaultPopoverConfig,
} from './popover-config';
import { PopoverRef } from './popover-ref';
import * as _ from 'lodash';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { PopoverHorizontalAlign, PopoverVerticalAlign } from './types';
import { NotificationAction, PopoverNotificationService } from './notification.service';
import { ESCAPE } from '@angular/cdk/keycodes';
import { PopoverFlexibleTemplateComponent } from './popover-flexible-template/popover-flexible-template.component';

@Injectable({
  providedIn: 'root',
})
export class PopoverService implements OnDestroy {
  /** Emits when the popover is opened. */
  popoverOpened = new Subject<void>();
  /** Emits when the popover is closed. */
  popoverClosed = new Subject<void>();
  overlayRef: OverlayRef;

  config: PopoverConfig;

  private lastGlobalPopover: PopoverRef;
  private globalOverlays: OverlayRef[] = [];
  private globalPopovers: PopoverRef[] = [];

  private portal: TemplatePortal<any>;

  private anchorRef: ElementRef;

  private onDestroyed$: Subject<void> = new Subject<void>();

  private viewContainerRef: ViewContainerRef;

  private positionChangeSubscription: Subscription;

  private popover: PopoverFlexibleTemplateComponent;

  private popoverOpen = false;

  private notifications: PopoverNotificationService;

  private notificationsSubscription: Subscription;

  constructor(
    private ngZone: NgZone,
    private overlay: Overlay,
    private parentInjector: Injector,
    @Inject(POPOVER_CONFIG_TOKEN) private popoverConfig: PopoverConfig,
  ) {
  }

  private get overlayGlobalStrategy(): GlobalPositionStrategy {
    return this.overlay.position().global();
  }

  // GLOBAL STRATEGY
  show(data: PopoverData, config: PopoverConfig = defaultPopoverConfig): PopoverRef {
    this.config = _.merge(defaultPopoverConfig, config);

    if (this.config.stackStrategy === 'restart' && this.lastGlobalPopover) {
      this.lastGlobalPopover.close();
    }

    const positionStrategy = this.getPositionGlobalStrategy(this.config);

    const globalOverlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.getScrollStrategyInstance(this.config.scrollStrategy),
      panelClass: this.config.panelClass,
      hasBackdrop: this.config.hasBackdrop,
      backdropClass: this.config.backdropClass,
    });

    const popoverRef = new PopoverRef(globalOverlayRef);
    this.lastGlobalPopover = popoverRef;
    this.globalOverlays.push(globalOverlayRef);
    this.globalPopovers.push(popoverRef);

    const injector = this.getInjector(data, popoverRef, this.parentInjector);
    const component = data.component || PopoverGlobalTemplateComponent;

    const popoverPortal = new ComponentPortal(component, null, injector);

    globalOverlayRef.attach(popoverPortal);

    globalOverlayRef.detachments()
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(() => {
        this.repositionBelow();
      });

    return popoverRef;
  }

  // FLEXIBLE STRATEGY
  anchor(popover: PopoverFlexibleTemplateComponent, viewContainerRef: ViewContainerRef, anchor: ElementRef): void {
    // Destroy any previous popovers
    this.destroyPopover();

    // Assign local refs
    this.popover = popover;
    this.viewContainerRef = viewContainerRef;
    this.anchorRef = anchor;

    // Provide notification service as a communication channel between popover and anchor.
    // Then subscribe to notifications to take appropriate actions.
    this.popover.notifications = this.notifications = new PopoverNotificationService();
    this.subscribeToNotifications();
  }

  togglePopover(): void {
    return this.popoverOpen ? this.closePopover() : this.openPopover();
  }

  isPopoverOpen(): boolean {
    return this.popoverOpen;
  }

  openPopover(): void {
    if (this.overlayRef) {
      this.closePopover();
    }
    if (!this.popoverOpen) {
      this.createOverlay();
      this.subscribeToBackdrop();
      this.subscribeToEscape();
      this.subscribeToDetachments();
      this.saveOpenedState();
    }
  }

  closePopover(value?: any): void {
    if (this.overlayRef) {
      this.saveClosedState(value);
      this.overlayRef.detach();
    }
  }

  realignPopoverToAnchor(): void {
    if (this.overlayRef) {
      const config = this.overlayRef.getConfig();
      const strategy = config.positionStrategy as FlexibleConnectedPositionStrategy;
      strategy.reapplyLastPosition();
    }
  }

  ngOnDestroy(): void {
    this.destroyPopover();

    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
    if (this.positionChangeSubscription) {
      this.positionChangeSubscription.unsubscribe();
    }

    this.popoverOpened.complete();
    this.popoverClosed.complete();

    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  // GLOBAL STRATEGY
  private getPositionGlobalStrategy(config: PopoverConfig): GlobalPositionStrategy {
    return this.overlayGlobalStrategy
      [config.verticalAlign](this.getRelativeVPosition(this.lastGlobalPopover, config))
      [config.horizontalAlign](this.getRelativeHPosition(config));
  }

  private getScrollStrategyInstance(strategy: string): ScrollStrategy {
    switch (strategy) {
      case 'block':
        return this.overlay.scrollStrategies.block();
      case 'reposition':
        return this.overlay.scrollStrategies.reposition();
      case 'close':
        return this.overlay.scrollStrategies.close();
      case 'noop':
      default:
        return this.overlay.scrollStrategies.noop();
    }
  }

  private getRelativeVPosition(lastGlobalPopover: PopoverRef, config: PopoverConfig): string {
    let position = 0;
    const lastPopoverIsVisible = lastGlobalPopover && lastGlobalPopover.isVisible();

    if (lastPopoverIsVisible) {
      switch (config.verticalAlign) {
        case 'top':
          position = lastGlobalPopover.getPosition().bottom + config.positionOffset.bottom;
          break;
        case 'bottom':
          position = lastGlobalPopover.getPosition().top + config.positionOffset.top;
          break;
      }
    } else {
      position = config.positionOffset.top;
    }

    return position + config.positionOffset.vType;
  }

  private getRelativeHPosition(config: PopoverConfig): string {
    let position = 0;

    switch (config.horizontalAlign) {
      case 'right':
        position = config.positionOffset.right;
        break;
      case 'left':
        position = config.positionOffset.left;
        break;
    }

    return position + config.positionOffset.hType;
  }

  private getInjector(data: PopoverData, popoverRef: PopoverRef, parentInjector: Injector): PortalInjector {
    const tokens = new WeakMap();

    tokens.set(PopoverData, data);
    tokens.set(PopoverRef, popoverRef);

    return new PortalInjector(parentInjector, tokens);
  }

  private repositionBelow(): void {
    for (const i in this.globalOverlays) {
      if (!this.globalOverlays[i].hostElement) {
        this.globalOverlays.splice(+i, 1);
        this.globalPopovers.splice(+i, 1);
        this.globalOverlays.slice(+i, this.globalOverlays.length).forEach((item, index) => {
          setTimeout(() => {
            item.updatePositionStrategy(this.getRepositionGlobalStrategy(index - 1));
            item.updatePosition();
          }, 100);
        });
        break;
      }
    }
  }

  private getRepositionGlobalStrategy(prevPopoverIndex: number): GlobalPositionStrategy {
    return this.overlayGlobalStrategy
      [this.config.verticalAlign](this.getRelativeVPosition(this.globalPopovers[prevPopoverIndex], this.config))
      [this.config.horizontalAlign](this.getRelativeHPosition(this.config));
  }

  // FLEXIBLE STRATEGY
  private createOverlay(): OverlayRef {
    // Create overlay if it doesn't yet exist
    if (!this.overlayRef) {
      this.portal = new TemplatePortal(this.popover.templateRef, this.viewContainerRef);

      const popoverConfig = {
        panelClass: this.popover.panelClass,
        horizontalAlign: this.popover.horizontalAlign,
        verticalAlign: this.popover.verticalAlign,
        hasBackdrop: this.popover.hasBackdrop,
        backdropClass: this.popover.backdropClass,
        scrollStrategy: this.popover.scrollStrategy,
        forceAlignment: this.popover.forceAlignment,
        lockAlignment: this.popover.lockAlignment,
      };

      const overlayConfig = this.getOverlayConfig(popoverConfig, this.anchorRef);

      this.subscribeToPositionChanges(
        overlayConfig.positionStrategy as FlexibleConnectedPositionStrategy
      );

      this.overlayRef = this.overlay.create(overlayConfig);
    }

    // Actually open the popover
    this.overlayRef.attach(this.portal);
    return this.overlayRef;
  }

  private getOverlayConfig(config, anchor: ElementRef): OverlayConfig {
    return new OverlayConfig({
      panelClass: config.panelClass,
      positionStrategy: this.getPositionFlexibleStrategy(config, anchor),
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      scrollStrategy: this.getScrollStrategyInstance(config.scrollStrategy),
    });
  }

  private subscribeToPositionChanges(position: FlexibleConnectedPositionStrategy): void {
    if (this.positionChangeSubscription) {
      this.positionChangeSubscription.unsubscribe();
    }

    this.positionChangeSubscription = position.positionChanges
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(change => {
        // Position changes may occur outside the Angular zone
        this.ngZone.run(() => {
          this.popover.setAlignmentClasses(
            getHorizontalPopoverAlignment(change.connectionPair.overlayX),
            getVerticalPopoverAlignment(change.connectionPair.overlayY),
          );
        });
      });
  }

  private getPositionFlexibleStrategy(config, anchor: ElementRef): FlexibleConnectedPositionStrategy {
    // Attach the overlay at the preferred position
    const targetPosition = getPosition(config.horizontalAlign, config.verticalAlign);
    const positions = [targetPosition];

    const strategy = this.overlay.position()
      .flexibleConnectedTo(anchor)
      .withFlexibleDimensions(false)
      .withPush(false)
      .withViewportMargin(0)
      .withLockedPosition(config.lockAlignment);

    // Unless the alignment is forced, add fallBacks based on the preferred positions
    if (!config.forceAlignment) {
      const fallBacks = this.getFallbacks(config.horizontalAlign, config.verticalAlign);
      positions.push(...fallBacks);
    }

    return strategy.withPositions(positions);
  }

  private subscribeToNotifications(): void {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }

    this.notificationsSubscription = this.notifications.events()
      .subscribe(event => {
        switch (event.action) {
          case NotificationAction.OPEN:
            this.openPopover();
            break;
          case NotificationAction.CLOSE:
            this.closePopover(event.value);
            break;
          case NotificationAction.TOGGLE:
            this.togglePopover();
            break;
          case NotificationAction.UPDATE_CONFIG:
            this.destroyPopoverOnceClosed();
            break;
          case NotificationAction.REALIGN:
            this.realignPopoverToAnchor();
            break;
        }
      });
  }

  private subscribeToBackdrop(): void {
    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(() => this.popover.backdropClicked.emit());
  }

  private subscribeToEscape(): void {
    this.overlayRef
      .keydownEvents()
      .pipe(
        tap(event => this.popover.overlayKeydown.emit(event)),
        filter(event => event.keyCode === ESCAPE),
        takeUntil(this.popoverClosed),
        takeUntil(this.onDestroyed$),
      )
      .subscribe(() => this.closePopover());
  }

  private subscribeToDetachments(): void {
    this.overlayRef
      .detachments()
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(() => this.saveClosedState());
  }

  private saveOpenedState(): void {
    if (!this.popoverOpen) {
      this.popover.isOpened = this.popoverOpen = true;

      this.popoverOpened.next();
      this.popover.opened.emit();
    }
  }

  private saveClosedState(value?: any): void {
    if (this.popoverOpen) {
      this.popover.isOpened = this.popoverOpen = false;

      this.popoverClosed.next(value);
      this.popover.closed.emit(value);
    }
  }

  private destroyPopoverOnceClosed(): void {
    if (this.isPopoverOpen() && this.overlayRef) {
      this.overlayRef.detachments().pipe(
        take(1),
        takeUntil(this.onDestroyed$)
      ).subscribe(() => this.destroyPopover());
    } else {
      this.destroyPopover();
    }
  }

  private destroyPopover(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  private getFallbacks(
    hTarget: PopoverHorizontalAlign,
    vTarget: PopoverVerticalAlign
  ): ConnectionPositionPair[] {
    // Determine if the target alignments overlap the anchor
    const horizontalOverlapAllowed = hTarget !== 'left' && hTarget !== 'right';
    const verticalOverlapAllowed = vTarget !== 'top' && vTarget !== 'bottom';

    // If a target alignment doesn't cover the anchor, don't let any of the fallback alignments
    // cover the anchor
    const possibleHorizontalAlignments: PopoverHorizontalAlign[] =
      horizontalOverlapAllowed ?
        ['left', 'start', 'center', 'end', 'right'] :
        ['left', 'right'];
    const possibleVerticalAlignments: PopoverVerticalAlign[] =
      verticalOverlapAllowed ?
        ['top', 'start', 'center', 'end', 'bottom'] :
        ['top', 'bottom'];

    // Create fallbacks for each allowed prioritized fallback alignment combo
    const fallbacks: ConnectionPositionPair[] = [];
    prioritizeAroundTarget(hTarget, possibleHorizontalAlignments).forEach(h => {
      prioritizeAroundTarget(vTarget, possibleVerticalAlignments).forEach(v => {
        fallbacks.push(getPosition(h, v));
      });
    });

    // Remove the first item since it will be the target alignment and isn't considered a fallback
    return fallbacks.slice(1, fallbacks.length);
  }
}


/** Helper function to get a cdk position pair from PopoverComponent alignments. */
function getPosition(
  h: PopoverHorizontalAlign,
  v: PopoverVerticalAlign,
): ConnectionPositionPair {
  const {originX, overlayX} = getHorizontalConnectionPosPair(h);
  const {originY, overlayY} = getVerticalConnectionPosPair(v);
  return new ConnectionPositionPair({originX, originY}, {overlayX, overlayY});
}

/** Helper function to convert an overlay connection position to equivalent popover alignment. */
function getHorizontalPopoverAlignment(h: HorizontalConnectionPos): PopoverHorizontalAlign {
  if (h === 'start') {
    return 'right';
  }

  if (h === 'end') {
    return 'left';
  }

  return 'center';
}

/** Helper function to convert an overlay connection position to equivalent popover alignment. */
function getVerticalPopoverAlignment(v: VerticalConnectionPos): PopoverVerticalAlign {
  if (v === 'top') {
    return 'bottom';
  }

  if (v === 'bottom') {
    return 'top';
  }

  return 'center';
}

/** Helper function to convert alignment to origin/overlay position pair. */
function getHorizontalConnectionPosPair(h: PopoverHorizontalAlign):
  { originX: HorizontalConnectionPos, overlayX: HorizontalConnectionPos } {
  switch (h) {
    case 'left':
      return {originX: 'start', overlayX: 'end'};
    case 'start':
      return {originX: 'start', overlayX: 'start'};
    case 'end':
      return {originX: 'end', overlayX: 'end'};
    case 'right':
      return {originX: 'end', overlayX: 'start'};
    default:
      return {originX: 'center', overlayX: 'center'};
  }
}

/** Helper function to convert alignment to origin/overlay position pair. */
function getVerticalConnectionPosPair(v: PopoverVerticalAlign):
  { originY: VerticalConnectionPos, overlayY: VerticalConnectionPos } {
  switch (v) {
    case 'top':
      return {originY: 'top', overlayY: 'bottom'};
    case 'start':
      return {originY: 'bottom', overlayY: 'bottom'};
    case 'end':
      return {originY: 'top', overlayY: 'top'};
    case 'bottom':
      return {originY: 'bottom', overlayY: 'top'};
    default:
      return {originY: 'center', overlayY: 'center'};
  }
}


/**
 * Helper function that takes an ordered array options and returns a reorderded
 * array around the target item. e.g.:
 *
 * target: 3; options: [1, 2, 3, 4, 5, 6, 7];
 *
 * return: [3, 4, 2, 5, 1, 6, 7]
 */
function prioritizeAroundTarget<T>(target: T, options: T[]): T[] {
  const targetIndex = options.indexOf(target);

  // Set the first item to be the target
  const reordered = [target];

  // Make left and right stacks where the highest priority item is last
  const left = options.slice(0, targetIndex);
  const right = options.slice(targetIndex + 1, options.length).reverse();

  // Alternate between stacks until one is empty
  while (left.length && right.length) {
    reordered.push(right.pop());
    reordered.push(left.pop());
  }

  // Flush out right side
  while (right.length) {
    reordered.push(right.pop());
  }

  // Flush out left side
  while (left.length) {
    reordered.push(left.pop());
  }

  return reordered;
}
