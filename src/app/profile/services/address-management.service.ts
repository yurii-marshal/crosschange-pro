import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IWalletAddress } from '../../shared/interfaces/address.interface';
import { ApiService } from 'shared-kuailian-lib';
import { HttpParams } from '@angular/common/http';
import { defaultPagination } from '../../shared/constants/pagination.constant';
import { Params } from '@angular/router';

export interface IQueryParams {
  orderby: string;
  offset: string;
  limit: string;
}

export interface IWalletListResponse {
  results: IWalletAddress[];
  count: number;
}

const addressMock = [
  {
    id: 1,
    key: 'DASH',
    label: 'Personal Wallet',
    address: '33yPjjSMGHPp8zj1ZXySNJzSUfVSbpXEuL',
    isWhitelisted: true
  },
  {
    id: 2,
    key: 'BSV',
    label: 'Personal Wallet',
    address: '33yPjjSMGHPp8zj1ZXySNJzSUfVSbpXEuL',
    isWhitelisted: false
  },
  {
    id: 3,
    key: 'ETH',
    label: 'Personal Wallet',
    address: '33yPjjSMGHPp8zj1ZXySNJzSUfVSbpXEuL',
    isWhitelisted: false
  },
  {
    id: 4,
    key: 'BCH',
    label: 'Personal Wallet',
    address: '33yPjjSMGHPp8zj1ZXySNJzSUfVSbpXEuL',
    isWhitelisted: true
  },
  {
    id: 5,
    key: 'LTC',
    label: 'Personal Wallet',
    address: '33yPjjSMGHPp8zj1ZXySNJzSUfVSbpXEuL',
    isWhitelisted: true
  }
];

@Injectable({
  providedIn: 'root'
})
export class AddressManagementService extends ApiService {

  constructor(
    protected injector: Injector,
  ) {
    super(injector);
  }

  getWalletAddressesList(search: string, params: Params, whitelistedOnly: string): Observable<IWalletListResponse> {
    return of({
      count: addressMock.length,
      results: addressMock,
    });

    // let parameters = new HttpParams();
    // parameters = parameters
    //   .set('search', search || '')
    //   .set('orderby', 'coin')
    //   .set('whitelisted', whitelistedOnly || '')
    //   .set('offset', params.offset || defaultPagination.offset)
    //   .set('limit', params.limit || defaultPagination.limit);
    //
    // return super.get('wallet/address', {params: parameters});
  }

  toggleWhitelistEnable(): Observable<any> {
    return of(true);

    // return super.post('url', {});
  }

  addToWhitelist(items: number[]): Observable<any> {
    return of(true);

    // let params = new HttpParams();
    // params = params.set('action', 'enable');
    //
    // return super.patch('wallet/address/whitelist', { ids: items }, params);
  }

  removeFromWhitelist(items: number[]): Observable<any> {
    return of(true);

    // let params = new HttpParams();
    // params = params.set('action', 'disable');
    //
    // return super.patch('wallet/address/whitelist', { ids: items }, params);
  }

  deleteItems(items: number[]): Observable<any> {
    return of(true);

    // return super.delete('wallet/address', { body: items});
  }
}
