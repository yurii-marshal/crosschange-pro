import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'shared-kuailian-lib';
import { IApiResponse } from 'shared-kuailian-lib';
import { IWithdraw, IWithdrawItem } from '../../shared/interfaces/withdraw-item.interface';

@Injectable({
  providedIn: 'root'
})
export class WithdrawService extends ApiService {
  private withdrawsMock: IApiResponse<IWithdrawItem> = {
    count: 0,
    next: '',
    previous: '',
    results: [
      {
        date: 48394895,
        cryptocurrency: 'eth',
        amount: 3384,
        status: 'delivered',
        hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
      },
      {
        date: 48394895,
        cryptocurrency: 'eth',
        amount: 3384,
        status: 'delivered',
        hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
      },
      {
        date: 48394895,
        cryptocurrency: 'eth',
        amount: 3384,
        status: 'delivered',
        hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
      },
      {
        date: 48394895,
        cryptocurrency: 'eth',
        amount: 3384,
        status: 'delivered',
        hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
      },
      {
        date: 48394895,
        cryptocurrency: 'eth',
        amount: 3384,
        status: 'delivered',
        hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
      },
      {
        date: 48394895,
        cryptocurrency: 'eth',
        amount: 3384,
        status: 'delivered',
        hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
      },
      {
        date: 48394895,
        cryptocurrency: 'eth',
        amount: 3384,
        status: 'delivered',
        hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
      },
      {
        date: 48394895,
        cryptocurrency: 'eth',
        amount: 3384,
        status: 'delivered',
        hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
      },
    ]
  };

  constructor(
    protected injector: Injector,
  ) {
    super(injector);
  }

  // TODO: API
  getWithdrawHistory(params): Observable<IApiResponse<IWithdrawItem>> {
    const req = {
      type: 'deposit',
      ...params
    };
    return of(this.withdrawsMock);
    // return super.get<IApiResponse<IWithdrawItem>>('spot-wallets/withdraws', req).pipe(share());
  }

  // TODO: API
  getWithdrawFee(coin: string, amount: number): Observable<number> {
    return of(amount ? Math.random() * 0.1 : 0);
  }

  // TODO: API
  sendWithdraw(withdraw: IWithdraw): Observable<any> {
    return of('done');
  }
}
