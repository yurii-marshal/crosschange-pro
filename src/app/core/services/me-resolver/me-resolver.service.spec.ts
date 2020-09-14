import { TestBed } from '@angular/core/testing';

import { MeResolverService } from './me-resolver.service';

describe('MeResolverService', () => {
  let service: MeResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
