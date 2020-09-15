import { TestBed } from '@angular/core/testing';

import { CanShowProGuard } from './can-show-pro.guard';

describe('CanShowProGuard', () => {
  let guard: CanShowProGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanShowProGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
