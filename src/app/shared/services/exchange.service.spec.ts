import { TestBed } from '@angular/core/testing';
import { ExchangeService, IChartPeriods } from './exchange.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { ENVIRONMENT, IEnvironment } from 'shared-kuailian-lib';
import { currenciesMock } from '../../../../testing/ExchangeServiceMock';

describe('ExchangeService', () => {
  let service: ExchangeService;
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
    service = TestBed.inject(ExchangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should send get currencies request', (done) => {
    service.getCurrencies().subscribe(res => {
      expect(res).toEqual(currenciesMock);
      done();
    });

    const httpRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/exchanges/currencies/`);
    expect(httpRequest.request.method).toEqual('GET');
    httpRequest.flush(currenciesMock);
  });

  it('should send get chart data request', (done) => {
    const mock = { points: [], axis: []};
    service.getChartData('btc', 'btc', IChartPeriods.DAY).subscribe(res => {
      expect(res).toEqual(mock);
      done();
    });

    const httpRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/exchanges/graph/`);
    expect(httpRequest.request.method).toEqual('GET');
    httpRequest.flush(mock);
  });

});
