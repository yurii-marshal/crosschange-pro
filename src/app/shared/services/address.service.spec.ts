import { TestBed } from '@angular/core/testing';

import { AddressService } from './address.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';

describe('AddressService', () => {
  let service: AddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        {provide: ENVIRONMENT, useValue: environment as IEnvironment},
      ]
    });
    service = TestBed.inject(AddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
