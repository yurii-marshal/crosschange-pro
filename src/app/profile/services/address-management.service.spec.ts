import { TestBed } from '@angular/core/testing';

import { AddressManagementService } from './address-management.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';

describe('AddressManagementService', () => {
  let service: AddressManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        {provide: ENVIRONMENT, useValue: environment as IEnvironment},
      ]
    });
    service = TestBed.inject(AddressManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
