import { NgModule, ModuleWithProviders } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';

import { PopoverComponent } from './popover.component';
import { defaultPopoverConfig, POPOVER_CONFIG_TOKEN } from './popover-config';

@NgModule({
  imports: [OverlayModule, MatIconModule],
  declarations: [PopoverComponent],
  entryComponents: [PopoverComponent]
})
export class PopoverModule {
  public static forRoot(config = defaultPopoverConfig): ModuleWithProviders {
    return {
      ngModule: PopoverModule,
      providers: [
        {
          provide: POPOVER_CONFIG_TOKEN,
          useValue: { ...defaultPopoverConfig, ...config },
        },
      ],
    };
  }
}
