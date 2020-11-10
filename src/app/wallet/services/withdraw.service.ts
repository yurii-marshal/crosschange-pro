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
    count: 10,
    next: '',
    previous: '',
    results: [
      {
        date: new Date(2020, 10, 5).toString(),
        cryptocurrency: 'btc',
        amount: 43534,
        status: 'delivered',
        hash: 'dfhdsfhdshsdfh',
      },
      {
        date: new Date(2020, 8, 4).toString(),
        cryptocurrency: 'ltc',
        amount: 23412,
        status: 'pending',
        hash: 'seddvchrtchsdthcstrhc',
      },
      {
        date: new Date(2020, 11, 3).toString(),
        cryptocurrency: 'eth',
        amount: 2342,
        status: 'pending',
        hash: 'szcdgsedrhdfhbdfg',
      },
      {
        date: new Date(2020, 12, 6).toString(),
        cryptocurrency: 'eth',
        amount: 32462,
        status: 'pending',
        hash: 'acsgcaercgargcergc',
      },
      {
        date: new Date(2020, 4, 1).toString(),
        cryptocurrency: 'dash',
        amount: 32462,
        status: 'delivered',
        hash: 'acergcarcgdzsfgcsdfg',
      },
      {
        date: new Date(2020, 3, 2).toString(),
        cryptocurrency: 'xrp',
        amount: 623462,
        status: 'canceled',
        hash: 'sadgcasetcasctsrgc',
      },
      {
        date: new Date(2020, 7, 6).toString(),
        cryptocurrency: 'bch',
        amount: 42343,
        status: 'delivered',
        hash: 'sadfcasdfcasdcf',
      },
      {
        date: new Date(2020, 1, 1).toString(),
        cryptocurrency: 'usdt',
        amount: 23421,
        status: 'delivered',
        hash: 'dsfvhcsdtcht',
      },
      {
        date: new Date(2020, 2, 9).toString(),
        cryptocurrency: 'usdc',
        amount: 36234,
        status: 'delivered',
        hash: 'axsgrsxgsrgx',
      },
      {
        date: new Date(2020, 5, 19).toString(),
        cryptocurrency: 'xtz',
        amount: 23462346,
        status: 'delivered',
        hash: 'axrgargxargxsrgcx',
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
