import { Injectable, Injector } from '@angular/core';
import { IWallet } from '../src/app/shared/interfaces/wallet.interface';
import { IApiResponse } from 'shared-kuailian-lib';
import { IWithdraw, IWithdrawItem } from '../src/app/shared/interfaces/withdraw-item.interface';
import { Observable, of } from 'rxjs';

export const withdrawsMock: IApiResponse<IWithdrawItem> = {
  count: 20,
  next: '',
  previous: '',
  results: [
    {
      date: new Date().toString(),
      cryptocurrency: 'eth',
      amount: 3384,
      status: 'delivered',
      hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
    },
    {
      date: new Date().toString(),
      cryptocurrency: 'eth',
      amount: 3384,
      status: 'delivered',
      hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
    },
    {
      date: new Date().toString(),
      cryptocurrency: 'eth',
      amount: 3384,
      status: 'delivered',
      hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
    },
    {
      date: new Date().toString(),
      cryptocurrency: 'eth',
      amount: 3384,
      status: 'delivered',
      hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
    },
    {
      date: new Date().toString(),
      cryptocurrency: 'eth',
      amount: 3384,
      status: 'delivered',
      hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
    },
    {
      date: new Date().toString(),
      cryptocurrency: 'eth',
      amount: 3384,
      status: 'delivered',
      hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
    },
    {
      date: new Date().toString(),
      cryptocurrency: 'eth',
      amount: 3384,
      status: 'delivered',
      hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
    },
    {
      date: new Date().toString(),
      cryptocurrency: 'eth',
      amount: 3384,
      status: 'delivered',
      hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
    },
    {
      date: new Date().toString(),
      cryptocurrency: 'eth',
      amount: 3384,
      status: 'delivered',
      hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
    },
    {
      date: new Date().toString(),
      cryptocurrency: 'eth',
      amount: 3384,
      status: 'delivered',
      hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
    },
  ],
};

@Injectable({
  providedIn: 'root'
})
export class WithdrawServiceMock {
  private wallets: IWallet[] | null = null;
  private withdraws: IApiResponse<IWithdrawItem> = {
    count: 0,
    next: '',
    previous: '',
    results: []
  };

  constructor(protected injector: Injector) {
  }

  getWithdrawHistory(params): Observable<IApiResponse<IWithdrawItem>> {
    return of(withdrawsMock);
  }

  sendWithdraw(withdraw: IWithdraw): Observable<any> {
    return of({status: 200});
  }

}
