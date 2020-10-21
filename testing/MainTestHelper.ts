/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
import { DebugElement } from '@angular/core';

export const ButtonClickEvents = {
  left:  { button: 0 },
  right: { button: 2 }
};

export class MainTestHelper {
  /**
   * https://angular.io/guide/testing-components-scenarios#click-helper - from Angular v10 docs
   * Simulate element click. Defaults to mouse left-button click event.
   */
  public static click(el: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left): void {
    if (el instanceof HTMLElement) {
      el.click();
    } else {
      el.triggerEventHandler('click', eventObj);
    }
  }
}
