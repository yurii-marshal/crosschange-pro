import { TestBed } from '@angular/core/testing';

import { WalletService } from './wallet.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { IWallet } from '../../shared/interfaces/wallet.interface';
import { IApiResponse } from 'shared-kuailian-lib';


// TODO: change xdescribe to describe after switching to api in service
describe('WalletService', () => {
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

});
