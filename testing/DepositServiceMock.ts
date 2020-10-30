import { Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ITransactionItem } from '../src/app/shared/interfaces/transaction-item.interface';
import { depositsMock, IDepositHistoryRequest } from './WalletServiceMock';
import { IApiResponse } from 'shared-kuailian-lib';
export class DepositServiceMock {

  private deposits: IApiResponse<ITransactionItem> = {
    count: 0,
    next: '',
    previous: '',
    results: []
  };

  constructor(protected injector: Injector) {}

  getDepositHistory(params: IDepositHistoryRequest): Observable<IApiResponse<ITransactionItem>> {
    if (!params.cryptocurrency || !('offset' in params) || !('limit' in params)) {
      return of(this.deposits);
    }
    depositsMock.results = depositsMock.results.map(v => {
      v.cryptocurrency = params.cryptocurrency;
      v.amount = params.offset;
      return v;
    });
    this.deposits = depositsMock;
    return of(this.deposits);
  }
}
