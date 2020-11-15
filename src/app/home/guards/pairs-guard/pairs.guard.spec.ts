import { TestBed } from '@angular/core/testing';

import { PairsGuard } from './pairs.guard';

describe('PairsGuard', () => {
  let guard: PairsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PairsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
