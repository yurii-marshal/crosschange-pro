import { NgModule, ModuleWithProviders } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';

import { PopoverGlobalTemplateComponent } from './popover-global-template/popover-global-template.component';
import { defaultPopoverConfig, POPOVER_CONFIG_TOKEN } from './popover-config';
import { ObserversModule } from '@angular/cdk/observers';
import { PopoverFlexibleTemplateComponent } from './popover-flexible-template/popover-flexible-template.component';
import { PopoverAnchorDirective } from './popover.directive';
import { PopoverService } from './popover.service';

const components = [
  PopoverAnchorDirective,
  PopoverGlobalTemplateComponent,
  PopoverFlexibleTemplateComponent,
];

@NgModule({
  imports: [
    OverlayModule,
    MatIconModule,
    ObserversModule,
  ],
  exports: [...components],
  declarations: [...components],
  providers: [PopoverService],
  entryComponents: [...components],
})
export class PopoverModule {
  public static forRoot(config = defaultPopoverConfig): ModuleWithProviders {
    return {
      ngModule: PopoverModule,
      providers: [
        PopoverService,
        {
          provide: POPOVER_CONFIG_TOKEN,
          useValue: { ...defaultPopoverConfig, ...config },
        },
      ],
    };
  }
}
