import { Injectable, Injector, Inject } from '@angular/core';
import { GlobalPositionStrategy, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { PopoverComponent } from './popover.component';
import { PopoverData, POPOVER_CONFIG_TOKEN, PopoverConfig } from './popover-config';
import { PopoverRef } from './popover-ref';

@Injectable({
  providedIn: 'root',
})
export class PopoverService {
  private lastPopover: PopoverRef;

  constructor(
    private overlay: Overlay,
    private parentInjector: Injector,
    @Inject(POPOVER_CONFIG_TOKEN) private popoverConfig: PopoverConfig
  ) {
  }

  show(data: PopoverData): PopoverRef {
    const positionStrategy = this.getPositionStrategy();
    const overlayRef = this.overlay.create({positionStrategy});

    const popoverRef = new PopoverRef(overlayRef);
    this.lastPopover = popoverRef;

    const injector = this.getInjector(data, popoverRef, this.parentInjector);
    const popoverPortal = new ComponentPortal(PopoverComponent, null, injector);

    overlayRef.attach(popoverPortal);

    return popoverRef;
  }

  getPositionStrategy(): GlobalPositionStrategy {
    return this.overlay.position()
      .global()
      .top(this.getPosition())
      .right(this.popoverConfig.position.right + 'px');
  }

  getPosition(): string {
    const lastPopoverIsVisible = this.lastPopover && this.lastPopover.isVisible();
    const position = lastPopoverIsVisible
      ? this.lastPopover.getPosition().bottom
      : this.popoverConfig.position.top;

    return position + 'px';
  }

  getInjector(data: PopoverData, popoverRef: PopoverRef, parentInjector: Injector): PortalInjector {
    const tokens = new WeakMap();

    tokens.set(PopoverData, data);
    tokens.set(PopoverRef, popoverRef);

    return new PortalInjector(parentInjector, tokens);
  }
}
