import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { popoverAnimations, PopoverAnimationState } from '../popover-amination';
import { POPOVER_CONFIG_TOKEN, PopoverConfig, PopoverData } from '../popover-config';
import { PopoverRef } from '../popover-ref';

@Component({
  selector: 'app-popover',
  templateUrl: './popover-global-template.component.html',
  styleUrls: ['./popover-global-template.component.scss'],
  animations: [popoverAnimations.translatePopover],
})
export class PopoverGlobalTemplateComponent implements OnInit, OnDestroy {
  animationState: PopoverAnimationState = 'default';

  private intervalId;
  private defaultDuration = 3000;

  constructor(
    readonly data: PopoverData,
    readonly popoverRef: PopoverRef,
    @Inject(POPOVER_CONFIG_TOKEN) public popoverConfig: PopoverConfig,
  ) {
  }

  ngOnInit(): void {
    this.intervalId = setTimeout(() => this.animationState = 'closing', this.data.duration || this.defaultDuration);
  }

  ngOnDestroy(): void {
    clearTimeout(this.intervalId);
  }

  close(): void {
    this.animationState = 'closing';
  }

  onFadeFinished(event: any): void {
    const {toState} = event;
    const isFadeOut = (toState as PopoverAnimationState) === 'closing';
    const itFinished = this.animationState === 'closing';

    if (isFadeOut && itFinished) {
      this.popoverRef.close();
    }
  }
}
