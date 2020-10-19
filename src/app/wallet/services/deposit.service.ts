import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ITransactionItem, TransactionStatus, TransactionType } from '../../shared/interfaces/transaction-item.interface';
import { ApiService } from 'shared-kuailian-lib';
import { IApiResponse } from 'shared-kuailian-lib';
import { share } from 'rxjs/operators';

const depositsMock: IApiResponse<ITransactionItem> = {
  count: 50,
  next: '',
  previous: '',
  results: new Array(10).fill({
    date: new Date().toString(),
    cryptocurrency: 'btc',
    amount: 1,
    status: TransactionStatus.NEW,
    tx_hash: '234jl6k23j4kl6j2346j',
    type: TransactionType.DEPOSIT
  })
};

export interface IDepositHistoryRequest {
  cryptocurrency: string;
  offset?: number;
  limit?: number;
  ordering?: string;
}


@Injectable({
  providedIn: 'root'
})
export class DepositService extends ApiService {

  private deposits: IApiResponse<ITransactionItem> = {
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

  getDepositHistory(params: IDepositHistoryRequest): Observable<IApiResponse<ITransactionItem>> {
    if (!params.cryptocurrency || !('offset' in params) || !('limit' in params)) {
      return of(this.deposits);
    }
    const req = {
      type: 'deposit',
        ...params
    };
    return super.get<IApiResponse<ITransactionItem>>('spot-wallets/transactions', req).pipe(share());
  }
}
