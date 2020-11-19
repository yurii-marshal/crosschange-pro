import { TestBed } from '@angular/core/testing';

import { PopoverService } from './popover.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { defaultPopoverConfig, POPOVER_CONFIG_TOKEN } from './popover-config';

describe('PopoverService', () => {
  let service: PopoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OverlayModule
      ],
      providers: [
        {
          provide: POPOVER_CONFIG_TOKEN,
          useValue: defaultPopoverConfig
        }
      ]
    });
    service = TestBed.inject(PopoverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
