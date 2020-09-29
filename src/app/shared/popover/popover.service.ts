import { Injectable, Injector, Inject, ElementRef, OnDestroy } from '@angular/core';
import { FlexibleConnectedPositionStrategy, GlobalPositionStrategy, Overlay, OverlayRef, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { PopoverComponent } from './popover.component';
import { PopoverData, POPOVER_CONFIG_TOKEN, PopoverConfig, defaultPopoverConfig } from './popover-config';
import { PopoverRef } from './popover-ref';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PopoverService implements OnDestroy {
  public config: PopoverConfig;
  private lastPopover: PopoverRef;
  private lastOverlay: OverlayRef;

  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private overlay: Overlay,
    private parentInjector: Injector,
    @Inject(POPOVER_CONFIG_TOKEN) private popoverConfig: PopoverConfig,
  ) {
  }

  show(data: PopoverData, config: PopoverConfig = defaultPopoverConfig): PopoverRef {
    this.config = _.merge(defaultPopoverConfig, config);

    // TODO: flexible strategy connection
    const anchor = null;

    if (this.config.stackStrategy === 'restart' && this.lastPopover) {
      this.lastPopover.close();
    }

    const positionStrategy = this.getPositionStrategy(this.config, anchor);

    const overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.getScrollStrategyInstance(this.config.scrollStrategy),
      panelClass: this.config.panelClass,
      hasBackdrop: this.config.hasBackdrop,
      backdropClass: this.config.backdropClass,
    });

    const popoverRef = new PopoverRef(overlayRef);
    this.lastPopover = popoverRef;
    this.lastOverlay = overlayRef;

    const injector = this.getInjector(data, popoverRef, this.parentInjector);
    const component = data.component || PopoverComponent;

    const popoverPortal = new ComponentPortal(component, null, injector);

    overlayRef.attach(popoverPortal);

    this.lastOverlay.detachments()
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(() => {
        // TODO: reposition to top on previous popover closing
        // this.overlay.position().global()
        //   .top(config.positionOffset.bottom + this.config.positionOffset.vType);
      });

    return popoverRef;
  }

  getPositionStrategy(config: PopoverConfig, anchor: ElementRef): GlobalPositionStrategy | FlexibleConnectedPositionStrategy {
    switch (config.anchorStrategy) {
      case 'global':
        // TODO: handle all positions
        return this.overlay.position()
          .global()
          .top(this.getPosition(config))
          .right(config.positionOffset.right + config.positionOffset.hType);
      case 'flexible':
        // TODO: create anchor directive for flexible strategy connection
        return this.overlay.position()
          .flexibleConnectedTo(anchor)
          .withFlexibleDimensions(false)
          .withPush(false)
          .withViewportMargin(0)
          .withLockedPosition(config.lockAlignment);
    }
  }

  getPosition(config: PopoverConfig): string {
    const lastPopoverIsVisible = this.lastPopover && this.lastPopover.isVisible();
    const position = lastPopoverIsVisible
      ? this.lastPopover.getPosition().bottom + config.positionOffset.bottom
      : config.positionOffset.top;

    return position + this.config.positionOffset.vType;
  }

  getInjector(data: PopoverData, popoverRef: PopoverRef, parentInjector: Injector): PortalInjector {
    const tokens = new WeakMap();

    tokens.set(PopoverData, data);
    tokens.set(PopoverRef, popoverRef);

    return new PortalInjector(parentInjector, tokens);
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
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
}
