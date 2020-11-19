import { TestBed } from '@angular/core/testing';
import { IconService } from './icon.service';

// TESTS ARE IMPLEMENTED IN shared-kuailian-lib
describe('IconService', () => {
  let service: IconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
