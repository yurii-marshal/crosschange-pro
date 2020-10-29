import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IWalletAddress } from '../../shared/interfaces/address.interface';
import { ApiService } from 'shared-kuailian-lib';
import { HttpParams } from '@angular/common/http';
import { defaultPagination } from '../../shared/constants/pagination.constant';

const addressMock: IWalletAddress = {
  id: 34354,
  key: 'usdc',
  label: 'Personal Wallet',
  address: '1658wDe3fGGmYDBszD8uNNXYJfSo8eYmYJ',
  memo: '',
  tag: '',
  isWhitelisted: true,
};

@Injectable({
  providedIn: 'root'
})
export class AddressManagementService extends ApiService {

  constructor(
    protected injector: Injector,
  ) {
    super(injector);
  }

  getAddressList(params): Observable<any> {
    const addresses = [...Array(9)];
    return of({
      count: 9,
      results: addresses.map(() => addressMock),
    });

    // let parameters = new HttpParams();
    // parameters = parameters
    //   .set('search', params.search || '')
    //   .set('showWhitelistedOnly', params.showWhitelistedOnly || '')
    //   .set('orderby', params.orderby || 'last')
    //   .set('offset', params.offset || defaultPagination.offset)
    //   .set('limit', params.limit || defaultPagination.limit);
    //
    // return super.get('exchanges/address-management', {params: parameters});
  }
}
