import { TestBed } from '@angular/core/testing';

import { DepositService } from './deposit.service';
import { TransactionStatus, TransactionType } from '../../shared/interfaces/transaction-item.interface';
import { environment } from '../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('DepositService', () => {
  let service: DepositService;
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
    service = TestBed.inject(DepositService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should fetch transactions history', (done) => {
    const mock = {
      count: 10,
      next: '',
      previous: '',
      results: [
        {
          date: '',
          cryptocurrency: '',
          amount: 1,
          status: TransactionStatus.NEW,
          tx_hash: '',
          type: TransactionType.DEPOSIT
        }
      ]
    };

    service.getDepositHistory({
      cryptocurrency: 'btc',
      offset: 10,
      limit: 10
    }).subscribe(res => {
      expect(res).toEqual(mock);
      done();
    });

    const httpRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/spot-wallets/transactions/`);
    expect(httpRequest.request.method).toEqual('GET');
    httpRequest.flush(mock);
  });

  it('should fetch transactions history and have it changed', (done) => {
    const mock = {
      count: 10,
      next: '',
      previous: '',
      results: [
        {
          date: new Date().toString(),
          cryptocurrency: 'btc',
          amount: 1,
          status: TransactionStatus.NEW,
          tx_hash: '234jl6k23j4kl6j2346j',
          type: TransactionType.DEPOSIT
        }
      ]
    };

    const secondMock = {
      count: 20,
      next: '',
      previous: '',
      results: []
    };

    service.getDepositHistory({
      cryptocurrency: 'btc',
      offset: 10,
      limit: 10
    }).subscribe(res => {

      expect(res).toEqual(mock);
      service.getDepositHistory({
        cryptocurrency: 'btc',
        offset: 20,
        limit: 10
      }). subscribe(res2 => {
        expect(res2).toEqual(secondMock);
        done();
      });
      const secondRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/spot-wallets/transactions/`);
      expect(secondRequest.request.method).toEqual('GET');
      secondRequest.flush(secondMock);

    });

    const httpRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/spot-wallets/transactions/`);
    expect(httpRequest.request.method).toEqual('GET');
    httpRequest.flush(mock);
  });

});
