import { Injectable, Injector } from '@angular/core';
import { ITransactionItem } from '../../shared/interfaces/transaction-item.interface';
import { Observable, of } from 'rxjs';
import { share } from 'rxjs/operators';
import { ApiService } from 'shared-kuailian-lib';
import { IApiResponse } from 'shared-kuailian-lib';
import { IWithdraw } from '../../shared/interfaces/withdraw-item.interface';

@Injectable({
  providedIn: 'root'
})
export class WithdrawService extends ApiService {
  private withdraws: IApiResponse<ITransactionItem> = {
    count: 0,
    next: '',
    previous: '',
    results: []
  };

  constructor(
    protected injector: Injector,
  ) {
    super(injector);
  }

  // TODO: API
  getWithdrawHistory(params): Observable<IApiResponse<ITransactionItem>> {
    if (!params.cryptocurrency || !('offset' in params) || !('limit' in params)) {
      return of(this.withdraws);
    }
    const req = {
      type: 'deposit',
      ...params
    };
    return super.get<IApiResponse<ITransactionItem>>('spot-wallets/transactions', req).pipe(share());
  }

  // TODO: API
  getWithdrawFee(coin: string, amount: number): Observable<number> {
    console.log(coin, amount);
    return of(amount ? Math.random() * 0.1 : 0);
  }

  sendWithdraw(withdraw: IWithdraw): Observable<any> {
    return of('done');
  }
}
