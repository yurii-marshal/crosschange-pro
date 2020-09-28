import { InjectionToken, TemplateRef } from '@angular/core';

export class PopoverData {
  type: PopoverType;
  text?: string;
  template?: TemplateRef<any>;
  templateContext?: {};
}

export type PopoverType = 'warning' | 'info' | 'success';

export interface PopoverConfig {
  position?: {
    top: number;
    right: number;
  };
  animation?: {
    fadeOut: number;
    fadeIn: number;
  };
}

export const defaultPopoverConfig: PopoverConfig = {
  position: {
    top: 20,
    right: 20,
  },
  animation: {
    fadeOut: 2500,
    fadeIn: 300,
  },
};

export const POPOVER_CONFIG_TOKEN = new InjectionToken('popover-config');
