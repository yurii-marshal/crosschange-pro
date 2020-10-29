import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { commissionsData } from './commissionsData';

export interface ICommissionCoin {
  cryptocurrency: string;
  withdraw_fee: number;
  deposit_fee: number | 'Free';
  withdrawal_minimum: number;
  name: string;
}



@Injectable({
  providedIn: 'root'
})
export class StaticPagesService {
  constructor() { }


  getCommissionsData(): Observable<ICommissionCoin[]> {
    return of(commissionsData);
  }
}
