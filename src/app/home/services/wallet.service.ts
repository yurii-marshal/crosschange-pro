import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TradeType } from '../../core/interfaces/trade-type.interface';
import { Memoized } from '../../core/decorators/memoized.decorator';

const mockDataBalanceTypes = {
  fiat: {
    eur: [
      {id: 0, label: 'AUD'},
      {id: 1, label: 'BIDR'},
      {id: 2, label: 'BKRW'},
      {id: 3, label: 'BTC'},
      {id: 4, label: 'BUSD'},
      {id: 5, label: 'DAI'},
      {id: 6, label: 'XXO'},
    ],
    usd: [
      {id: 0, label: 'AUD'},
      {id: 1, label: 'BIDR'},
      {id: 2, label: 'BKRW'},
      {id: 3, label: 'BTC'},
      {id: 4, label: 'BUSD'},
      {id: 5, label: 'DAI'},
      {id: 6, label: 'XXO'},
    ],
  },
  crosschange_ea: {
    eur: [
      {id: 0, label: 'AUD'},
      {id: 1, label: 'BIDR'},
    ],
    usd: [
      {id: 0, label: 'AUD'},
      {id: 1, label: 'BIDR'},
    ],
  },
  crypto: {
    eur: [
      {id: 3, label: 'BTC'},
      {id: 4, label: 'BUSD'},
      {id: 5, label: 'DAI'},
      {id: 6, label: 'XXO'},
    ],
    usd: [
      {id: 0, label: 'AUD'},
      {id: 1, label: 'BIDR'},
    ],
  },
};

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor() {
  }

  @Memoized()
  getTradeTypes(balanceType: string, currencyType: string): Observable<TradeType[]> {
    return of(mockDataBalanceTypes[balanceType][currencyType]);
  }
}
