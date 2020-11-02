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
  getWithdrawFee(req): Observable<number> {
    return of(req.amount ? Math.random() * 0.1 : 0);
    // return super.get<IApiResponse<IWithdrawItem>>('spot-wallets/withdraw-fee', coin, amount).pipe(share());
  }

  // TODO: API
  sendWithdraw(withdraw: IWithdraw): Observable<any> {
    return of('done');
    // return super.post<IApiResponse<IWithdrawItem>>('spot-wallets/send-withdraw', withdraw).pipe(share());
  }
}
