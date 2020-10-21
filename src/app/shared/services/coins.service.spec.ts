import { TestBed } from '@angular/core/testing';

import { CoinsService } from './coins.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';

// TODO: change xdescribe to describe after switching to api in service
xdescribe('CoinsService', () => {
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
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send get coins request', (done) => {
    const mock = [{ key: '', name: '', is_popular: true }];

    service.getCoins().subscribe(res => {
      expect(res).toEqual(mock);
      done();
    });

    const httpRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/exchanges/coins/`);
    expect(httpRequest.request.method).toEqual('GET');
    httpRequest.flush(mock);
  });


  it('should cache get coins response', (done) => {
    const mock = [ { key: '', name: '', is_popular: true } ];

    service.getCoins().subscribe(res => {
      service.getCoins().subscribe(secondRes => {
        expect(secondRes).toEqual(mock);
        done();
      });
    });

    const httpRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/exchanges/coins/`);
    expect(httpRequest.request.method).toEqual('GET');
    httpRequest.flush(mock);
  });

  it('should get popular coins', (done) => {
    const mock = [
      { key: 'a', name: 'a', is_popular: false },
      { key: 'b', name: 'b', is_popular: true }
    ];
    const expected = [{ key: 'b', name: 'b', is_popular: true }];

    service.getPopular().subscribe(res => {
      expect(res).toEqual(expected);
      done();
    });

    const httpRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/exchanges/coins/`);
    expect(httpRequest.request.method).toEqual('GET');

    // Provide each request with a mock response
    httpRequest.flush(mock);
  });

});
