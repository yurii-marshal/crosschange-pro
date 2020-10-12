import { TestBed } from '@angular/core/testing';

import { MarketsService } from './markets.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';

describe('MarketsService', () => {
  let service: MarketsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        {
          provide: ENVIRONMENT,
          useValue: environment as IEnvironment
        },
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(MarketsService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send get markets request with expected params', (done) => {
    const pagination = {
      offset: 0,
      limit: 5,
    };
    const mockQuery = 'test';

    service.loadPairs('test', {offset: pagination.offset, limit: pagination.limit}).subscribe(res => {
      expect(res).toEqual({count: 0, results: []});
      done();
    });

    const httpRequest = httpMock.expectOne(
      `${environment.projectApiUrl}/api/v1/exchanges/markets/?search=${mockQuery}&type=favorite&orderby=last&offset=${pagination.offset}&limit=${pagination.limit}`
    );

    expect(httpRequest.request.method).toEqual('GET');
    httpRequest.flush({count: 0, results: []});
  });

  it('should send post query to add favorite', (done) => {
    service.addToFavorite('test').subscribe(res => {
      expect(res).toEqual('test');
      done();
    });

    const httpRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/exchanges/rates/favorites/`);

    expect(httpRequest.request.method).toEqual('POST');
    httpRequest.flush('test');
  });

  it('should send delete query to delete favorite', (done) => {
    service.deleteFromFavourite('test').subscribe(res => {
      expect(res).toEqual({});
      done();
    });

    const httpRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/exchanges/rates/favorites/`);

    expect(httpRequest.request.method).toEqual('DELETE');
    httpRequest.flush({});
  });

  it('should send get rates query', (done) => {
    service.loadWidgetsData().subscribe(res => {
      expect(res).toEqual([]);
      done();
    });

    const httpRequest = httpMock.expectOne(
      `${environment.projectApiUrl}/api/v1/exchanges/rates/?pairs=BTCUSD,ETHUSD,LTCUSD,DASHUSD&provider=kraken`
    );

    expect(httpRequest.request.method).toEqual('GET');
    httpRequest.flush([]);
  });
});
