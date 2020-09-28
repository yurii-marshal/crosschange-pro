import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { popoverAnimations, PopoverAnimationState } from './popover-amination';
import { POPOVER_CONFIG_TOKEN, PopoverConfig, PopoverData } from './popover-config';
import { PopoverRef } from './popover-ref';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
  animations: [popoverAnimations.fadePopover],
})
export class PopoverComponent implements OnInit, OnDestroy {
  animationState: PopoverAnimationState = 'default';
  iconType: string;

  private intervalId: number;

  constructor(
    readonly data: PopoverData,
    readonly ref: PopoverRef,
    @Inject(POPOVER_CONFIG_TOKEN) public popoverConfig: PopoverConfig,
  ) {
    this.iconType = data.type === 'success' ? 'done' : data.type;
  }

  ngOnInit(): void {
    this.intervalId = setTimeout(() => this.animationState = 'closing', 5000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.intervalId);
  }

  close(): void {
    this.ref.close();
  }

  onFadeFinished(event: any): void {
    const { toState } = event;
    const isFadeOut = (toState as PopoverAnimationState) === 'closing';
    const itFinished = this.animationState === 'closing';

    if (isFadeOut && itFinished) {
      this.close();
    }
  }
}
