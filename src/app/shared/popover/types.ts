export type PopoverType = 'warning' | 'info' | 'success';

export type PopoverScrollStrategy = 'noop' | 'block' | 'reposition' | 'close';
export const VALID_SCROLL: PopoverScrollStrategy[] = [
  'noop',
  'block',
  'reposition',
  'close'
];

export type Placement = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right'
  | 'left' | 'left-top' | 'left-bottom' | 'right' | 'right-top' | 'right-bottom';
export const VALID_PLACEMENT: Placement[] = [
  'top',
  'top-left',
  'top-right',
  'bottom',
  'bottom-left',
  'bottom-right',
  'left',
  'left-top',
  'left-bottom',
  'right',
  'right-top',
  'right-bottom'
];

export type PopoverHorizontalAlign = 'left' | 'start' | 'center' | 'end' | 'right';
export const VALID_HORIZ_ALIGN: PopoverHorizontalAlign[] = [
  'left',
  'start',
  'center',
  'end',
  'right'
];

export type PopoverVerticalAlign = 'top' | 'start' | 'center' | 'end' | 'bottom';
export const VALID_VERT_ALIGN: PopoverVerticalAlign[] = [
  'top',
  'start',
  'center',
  'end',
  'bottom'
];
