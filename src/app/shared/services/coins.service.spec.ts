import { TestBed } from '@angular/core/testing';

import { CoinsService } from './coins.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { skip } from 'rxjs/operators';

// TODO: CHANGE TO describe WHEN START USING REAL API REQUESTS
describe('CoinsService', () => {
  let service: CoinsService;
  let httpMock: HttpTestingController;
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
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CoinsService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send get coins request', (done) => {
    const mock = [{ key: '', name: '', is_popular: true }];

    // skip to skip initial value
    service.getCoins().pipe(skip(1)).subscribe(res => {
      expect(res).toEqual(mock);
      done();
    });

    const httpRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/exchanges/coins/`);
    expect(httpRequest.request.method).toEqual('GET');

    // Provide each request with a mock response
    httpRequest.flush(mock);
  });


  it('should cache get coins response', (done) => {
    const mock = [ { key: '', name: '', is_popular: true } ];

    // skip to skip initial value
    service.getCoins().pipe(skip(1)).subscribe(res => {
      service.getCoins().subscribe(secondRes => {
        expect(secondRes).toEqual(mock);
        done();
      });
    });

    const httpRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/exchanges/coins/`);
    expect(httpRequest.request.method).toEqual('GET');
    httpRequest.flush(mock);
  });

});
