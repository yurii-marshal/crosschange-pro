import {
  AnimationTriggerMetadata,
  trigger,
  state,
  transition,
  style,
  animate,
} from '@angular/animations';

export const popoverAnimations: {
  readonly translatePopover: AnimationTriggerMetadata;
  readonly rotatePopover: AnimationTriggerMetadata;
} = {
  translatePopover: trigger('translatePopover', [
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
  rotatePopover: trigger('rotatePopover', [
    state('default', style({
      'flex-grow': 1,
      transform: 'rotateX(0)',
      'transform-origin': '100% 0',
      opacity: 1,
      'will-change': 'transform, opacity',
      'transition-property': 'transform, opacity',
      'transition-duration': '0.25s',
    })),
    transition('void => *',
      [
        style({
          'transform-origin': 'center -100px',
          transform: 'rotateX(-15deg)',
          opacity: 0,
          'pointer-events': 'none',
        }),
        animate('{{ rotateIn }}ms')
      ]
    ),
    transition(
      'default => closing',
      animate('{{ rotateOut }}ms', style({
        'transform-origin': 'center -100px',
        transform: 'rotateX(-15deg)',
        opacity: 0,
        'pointer-events': 'none',
      })),
    ),
  ]),
};

export type PopoverAnimationState = 'default' | 'closing';
