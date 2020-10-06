import { InjectionToken } from '@angular/core';
import {
  PopoverScrollStrategy,
  PopoverType,
} from './types';

export class PopoverData {
  content?: string | object;
  component?: any;
  duration?: number;
}

export interface PopoverConfig {
  type?: PopoverType;
  scrollStrategy?: PopoverScrollStrategy;
  stackStrategy?: 'stack' | 'restart';

  horizontalAlign?: 'left' | 'centerHorizontally' | 'right';
  verticalAlign?: 'top' | 'centerVertically' | 'bottom';
  forceAlignment?: boolean;
  lockAlignment?: boolean;

  positionOffset?: {
    top?: number;
    bottom?: number;
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

  horizontalAlign: 'right',
  verticalAlign: 'top',
  forceAlignment: true,
  lockAlignment: false,

  positionOffset: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    vType: 'px',
    hType: 'px',
  },
  animation: {
    transitionStart: 500,
    transitionEnd: 99500,
  },
  hasBackdrop: false,
  backdropClass: 'cdk-overlay-transparent-backdrop',
  panelClass: 'popover-dialog-panel',
};

export const POPOVER_CONFIG_TOKEN = new InjectionToken('popover-config');
