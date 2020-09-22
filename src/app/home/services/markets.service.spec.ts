import { TestBed } from '@angular/core/testing';

import { MarketsService } from './markets.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('MarketsService', () => {
  let service: MarketsService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(MarketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
