import { TestBed } from '@angular/core/testing';

import { WalletService } from './wallet.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { TransactionStatus, TransactionType } from '../../shared/interfaces/transaction-item.interface';
import { IWallet } from '../../shared/interfaces/wallet.interface';
import { IApiResponse } from 'shared-kuailian-lib';


// TODO: change xdescribe to describe after switching to api in service
xdescribe('WalletService', () => {
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
    const mock: IApiResponse<IWallet> = {
      results: [ {
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
      } ],
      count: 1,
      previous: '',
      next: ''
    };

    service.getWallets().subscribe(res => {
      expect(res).toEqual(mock.results);
      done();
    });

    const httpRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/spot-wallets/`);

    expect(httpRequest.request.method).toEqual('GET');
    httpRequest.flush(mock);
  });


  it('should cache get wallets response', (done) => {
    const mock: IApiResponse<IWallet> = {
      results: [ {
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
      } ],
      count: 1,
      previous: '',
      next: ''
    };

    service.getWallets().subscribe(res => {
      service.getWallets().subscribe(secondRes => {
        expect(secondRes).toEqual(mock.results);
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

    const httpRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/transactions/`);
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
      const secondRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/transactions/`);
      expect(secondRequest.request.method).toEqual('GET');
      secondRequest.flush(secondMock);

    });

    const httpRequest = httpMock.expectOne(`${environment.projectApiUrl}/api/v1/transactions/`);
    expect(httpRequest.request.method).toEqual('GET');
    httpRequest.flush(mock);
  });

});
