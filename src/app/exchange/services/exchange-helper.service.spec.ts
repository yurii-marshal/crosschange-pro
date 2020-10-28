import { TestBed } from '@angular/core/testing';

import { ExchangeHelperService } from './exchange-helper.service';

describe('ExchangeHelperService', () => {
  let service: ExchangeHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExchangeHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
