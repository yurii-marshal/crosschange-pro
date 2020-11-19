import { TestBed } from '@angular/core/testing';

import { WithdrawService } from './withdraw.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';

describe('WithdrawService', () => {
  let service: WithdrawService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        {provide: ENVIRONMENT, useValue: environment as IEnvironment},
      ]
    });
    service = TestBed.inject(WithdrawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
