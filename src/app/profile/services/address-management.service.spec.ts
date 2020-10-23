import { TestBed } from '@angular/core/testing';

import { AddressManagementService } from './address-management.service';

describe('AddressManagementService', () => {
  let service: AddressManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddressManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
