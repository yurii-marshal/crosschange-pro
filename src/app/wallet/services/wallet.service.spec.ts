import { TestBed } from '@angular/core/testing';

import { WalletService } from './wallet.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { skip } from 'rxjs/operators';


fdescribe('WalletService', () => {
  let service: WalletService;
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
    service = TestBed.inject(WalletService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send get wallets request', (done) => {
    const mock = [];

    // skip to skip initial value
    service.getWallets().pipe(skip(1)).subscribe(res => {
      expect(res).toEqual(mock);
      done();
    });

    const httpRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/spot-wallets/`);
    expect(httpRequest.request.method).toEqual('GET');
    httpRequest.flush(mock);
  });


  it('should cache get wallets response', (done) => {
    const mock = [ {
      cryptocurrency: 'btc',
      address: '36KunwNiXhDy6bjJvUqeSMzgCZzfZBksid',
      tag: '',
      id: 0,
      balance: {
        total: 0,
        available: 0,
        in_order: 0,
        btc: 0
      },
    } ];
    // skip to skip initial value
    service.getWallets().pipe(skip(1)).subscribe(res => {
      service.getWallets().subscribe(secondRes => {
        expect(secondRes).toEqual(mock);
        done();
      });
    });

    const httpRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/spot-wallets/`);
    expect(httpRequest.request.method).toEqual('GET');
    httpRequest.flush(mock);
  });

  it('should fetch transactions history', (done) => {
    const mock = {
      count: 10,
      next: '',
      previous: '',
      results: []
    };

    // skip to skip initial value
    service.getDepositHistory({
      cryptocurrency: 'btc',
      offset: 10,
      limit: 10
    }).pipe(skip(1)).subscribe(res => {
      expect(res).toEqual(mock);
      done();
    });

    const httpRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/transactions/`);
    expect(httpRequest.request.method).toEqual('GET');
    httpRequest.flush(mock);
  });

  it('should fetch transactions history and have it changed', (done) => {
    const mock = {
      count: 10,
      next: '',
      previous: '',
      results: []
    };

    const secondMock = {
      count: 20,
      next: '',
      previous: '',
      results: []
    };
    let i = 0;
    // skip to skip initial value
    service.getDepositHistory({
      cryptocurrency: 'btc',
      offset: 10,
      limit: 10
    }).pipe(skip(1)).subscribe(res => {
      if (i === 0) {
        expect(res).toEqual(mock);
        i += 1;
        service.getDepositHistory({
          cryptocurrency: 'btc',
          offset: 10,
          limit: 10
        });
        const secondRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/transactions/`);
        expect(secondRequest.request.method).toEqual('GET');
        secondRequest.flush(secondMock);
      } else {
        expect(res).toEqual(secondMock);
        done();
        return;
      }

    });

    const httpRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/transactions/`);
    expect(httpRequest.request.method).toEqual('GET');
    httpRequest.flush(mock);
  });

});
