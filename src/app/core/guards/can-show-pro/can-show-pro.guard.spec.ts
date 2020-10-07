import { TestBed } from '@angular/core/testing';

import { CanShowProGuard } from './can-show-pro.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { environment } from '../../../../environments/environment';

describe('CanShowProGuard', () => {
  let guard: CanShowProGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: ENVIRONMENT,
          useValue: environment as IEnvironment
        },
      ]
    });
    guard = TestBed.inject(CanShowProGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
