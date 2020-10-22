import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IAddress } from '../../shared/interfaces/address.interface';

const addressMock: IAddress = {
  cryptocurrency: 'usdc',
  wallet_label: 'Personal Wallet',
  address: '1658wDe3fGGmYDBszD8uNNXYJfSo8eYmYJ',
  memo: '',
  tag: '',
  whitelist: true,
};

@Injectable({
  providedIn: 'root'
})
export class AddressManagementService {

  constructor() {
  }

  getAddressList(params): Observable<any> {
    const addresses = [...Array(9)];
    return of({
      count: 9,
      results: addresses.map(() => addressMock),
    });
  }
}
