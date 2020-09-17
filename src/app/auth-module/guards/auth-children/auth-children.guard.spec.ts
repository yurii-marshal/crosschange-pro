import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';

import { AuthChildrenGuard } from './auth-children.guard';

describe('AuthGuard', () => {
  let guard: AuthChildrenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: ENVIRONMENT,
          useValue: environment as IEnvironment
        },
      ]
    });
    guard = TestBed.inject(AuthChildrenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
