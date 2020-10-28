import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IWalletAddress } from '../interfaces/address.interface';
import { share } from 'rxjs/operators';
import { ApiService } from 'shared-kuailian-lib';

const addressesMock: IWalletAddress[] = [
  {
    id: 1,
    key: 'eth',
    label: 'Wallet Label 1',
    address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    memo: 'one',
    tag: 'tagg1',
    isWhitelisted: true,
  },
  {
    id: 1,
    key: 'eth',
    label: 'Wallet Label 2',
    address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    memo: 'one',
    tag: 'tagg2',
    isWhitelisted: true,
  },
  {
    id: 1,
    key: 'eth',
    label: 'Wallet Label 3',
    address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    memo: 'one',
    tag: 'tagg3',
    isWhitelisted: true,
  },
  {
    id: 1,
    key: 'eth',
    label: 'Wallet Label 4',
    address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    memo: 'one',
    tag: 'tagg4',
    isWhitelisted: true,
  },
];

@Injectable({
  providedIn: 'root'
})
export class AddressService extends ApiService {
  private addresses: IWalletAddress[] = [];

  constructor(protected injector: Injector) {
    super(injector);
  }

  getRecipientAddresses(): Observable<IWalletAddress[]> {
    if (this.addresses.length) {
      return of(this.addresses);
    }
    this.addresses = addressesMock;
    return of(addressesMock).pipe(share());

    // return super.get<IWalletAddress[]>('exchanges/recipient-addresses').pipe(
    //   tap((v) => this.coins = v),
    //   share()
    // );
  }
}
