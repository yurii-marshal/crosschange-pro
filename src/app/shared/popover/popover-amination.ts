import {
  AnimationTriggerMetadata,
  trigger,
  state,
  transition,
  style,
  animate,
} from '@angular/animations';

export const popoverAnimations: {
  readonly transformPopover: AnimationTriggerMetadata;
} = {
  transformPopover: trigger('transformPopover', [
    state('default', style({
      transform: 'translateX(0%)',
      visibility: 'visible',
      'transition-property': 'transform, opacity, visibility',
      'transition-duration': '0.7s',
      'transition-timing-function': 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
    })),
    transition('void => *',
      [
        style({
          transform: 'translateX(100%)',
          visibility: 'hidden',
        }),
        animate('{{ shiftIn }}ms')
      ]
    ),
    transition(
      'default => closing',
      animate('{{ shiftOut }}ms', style({
        transform: 'translateX(100%)',
        visibility: 'hidden',
      })),
    ),
  ]),
};

export type PopoverAnimationState = 'default' | 'closing';
