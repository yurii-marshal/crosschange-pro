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
        date: new Date().setDate(3).toString(),
        cryptocurrency: 'btc',
        amount: 100,
        status: 'pending',
        hash: 'dj433rh4h55u4y5g5i4gbiu5g45bg',
      },
      {
        date: new Date().setDate(4).toString(),
        cryptocurrency: 'bch',
        amount: 554,
        status: 'delivered',
        hash: 'yt8457yt84574y5874457ty4857t',
      },
      {
        date: new Date().setDate(5).toString(),
        cryptocurrency: 'dash',
        amount: 1,
        status: 'pending',
        hash: '4yv8t74y58vn47y5t495y847nvy4',
      },
      {
        date: new Date().setDate(10).toString(),
        cryptocurrency: 'eth',
        amount: 386984,
        status: 'delivered',
        hash: '785y7vnt457yt48v57nt784vy574v',
      },
      {
        date: new Date().setDate(15).toString(),
        cryptocurrency: 'ltc',
        amount: 1000,
        status: 'delivered',
        hash: '457ny849g4j5tv8y48tyb48v57ty84',
      },
      {
        date: new Date().setDate(20).toString(),
        cryptocurrency: 'xrp',
        amount: 100000,
        status: 'delivered',
        hash: 'n5tvu589ytm457ntv7495mytuv948',
      },
      {
        date: new Date().setDate(27).toString(),
        cryptocurrency: 'usdt',
        amount: 88,
        status: 'delivered',
        hash: '6548m9uy8tvn459ty458nt45tn5vn',
      },
      {
        date: new Date().setDate(28).toString(),
        cryptocurrency: 'usdc',
        amount: 5904,
        status: 'pending',
        hash: 'jgiruhg8598gy4584y95vy5jtv4y5',
      },
      {
        date: new Date().setDate(30).toString(),
        cryptocurrency: 'xtz',
        amount: 8439849385649,
        status: 'delivered',
        hash: 'rghi7458ty5948y5j9vt47yt957ty',
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
