import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ICommissionCoin {
  cryptocurrency: string;
  withdraw_fee: number;
  deposit_fee: number;
  withdrawal_minimum: number;
}

const commissionsMock: ICommissionCoin[] = [
  {
    cryptocurrency: 'BTC',
    withdraw_fee: 0,
    deposit_fee: 0,
    withdrawal_minimum: 0
  }
];

@Injectable({
  providedIn: 'root'
})
export class StaticPagesService {
  constructor() { }


  getCommissionsData(): Observable<ICommissionCoin[]> {
    return of(commissionsMock);
  }
}
