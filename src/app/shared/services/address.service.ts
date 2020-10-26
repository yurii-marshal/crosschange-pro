import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IAddress } from '../interfaces/address.interface';
import { share } from 'rxjs/operators';
import { ApiService } from 'shared-kuailian-lib';

const addressesMock: IAddress[] = [];

@Injectable({
  providedIn: 'root'
})
export class AddressService extends ApiService {
  private addresses: IAddress[] = [];

  constructor(protected injector: Injector) {
    super(injector);
  }

  getRecipientAddresses(): Observable<IAddress[]> {
    if (this.addresses.length) {
      return of(this.addresses);
    }
    this.addresses = addressesMock;
    return of(addressesMock).pipe(share());

    // return super.get<IAddress[]>('exchanges/recipient-addresses').pipe(
    //   tap((v) => this.coins = v),
    //   share()
    // );
  }
}
