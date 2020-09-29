import { InjectionToken } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

export class PopoverData {
  content?: string | object;
  component?: ComponentType<any>;
  duration?: number;
}

export type PopoverType = 'warning' | 'info' | 'success';

export interface PopoverConfig {
  type?: PopoverType;
  scrollStrategy?: 'noop' | 'block' | 'reposition' | 'close';
  stackStrategy?: 'stack' | 'restart';
  anchorStrategy?: 'global' | 'flexible';

  horizontalAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'center' | 'bottom';
  forceAlignment?: boolean;
  lockAlignment?: boolean;

  positionOffset?: {
    top?: number;
    bottom?: number;
    centerLeft?: number;
    centerTop?: number;
    left?: number;
    right?: number;
    vType?: 'px' | '%';
    hType?: 'px' | '%';
  };
  animation?: {
    transitionStart: number;
    transitionEnd: number;
  };
  hasBackdrop?: boolean;
  backdropClass?: string;
  panelClass?: string;
}

export const defaultPopoverConfig: PopoverConfig = {
  type: 'success',
  scrollStrategy: 'block',
  stackStrategy: 'stack',
  anchorStrategy: 'global',

  horizontalAlign: 'right',
  verticalAlign: 'top',
  forceAlignment: true,
  lockAlignment: false,

  positionOffset: {
    top: 20,
    right: 20,
    vType: 'px',
    hType: 'px',
  },
  animation: {
    transitionStart: 500,
    transitionEnd: 500,
  },
  hasBackdrop: false,
  backdropClass: 'cdk-overlay-transparent-backdrop',
  panelClass: 'popover-dialog-panel',
};

export const POPOVER_CONFIG_TOKEN = new InjectionToken('popover-config');
