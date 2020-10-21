import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ITransactionItem } from '../../shared/interfaces/transaction-item.interface';
import { ApiService } from 'shared-kuailian-lib';
import { IApiResponse } from 'shared-kuailian-lib';
import { share } from 'rxjs/operators';

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
