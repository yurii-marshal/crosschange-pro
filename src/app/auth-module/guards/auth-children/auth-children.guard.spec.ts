import { TestBed } from '@angular/core/testing';

import { AuthChildrenGuard } from './auth-children.guard';

describe('AuthGuard', () => {
  let guard: AuthChildrenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthChildrenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
