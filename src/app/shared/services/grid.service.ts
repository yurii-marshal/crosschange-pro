import { Injectable } from '@angular/core';
import { IExchangeData } from 'src/app/shared/interfaces/exchange-data.interface';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const mockTable: IExchangeData[] = [
  {
    favorite: true,
    pair: 'EOS / STEEM',
    last: '17.885 / $3.27',
    cng: '+1.29%',
    high: '0.015974',
    low: '0.015974',
    mktCap: '$967.17M',
    vol: '995.26'
  },
  {
    favorite: false,
    pair: 'AOS / STEEM',
    last: '17.885 / $3.27',
    cng: '+1.29%',
    high: '0.015974',
    low: '0.015974',
    mktCap: '$967.17M',
    vol: '995.26'
  },
  {
    favorite: false,
    pair: 'BOS / STEEM',
    last: '17.885 / $3.27',
    cng: '+1.29%',
    high: '0.015974',
    low: '0.015974',
    mktCap: '$967.17M',
    vol: '995.26'
  },
  {
    favorite: true,
    pair: 'TOS / STEEM',
    last: '17.885 / $3.27',
    cng: '+1.20%',
    high: '0.015974',
    low: '0.015974',
    mktCap: '$967.17M',
    vol: '995.26'
  },
  {
    favorite: false,
    pair: 'SOS / STEEM',
    last: '17.885 / $3.27',
    cng: '+1.23%',
    high: '0.015974',
    low: '0.015974',
    mktCap: '$967.17M',
    vol: '995.26'
  },
  {
    favorite: true,
    pair: 'EOS / STEEM',
    last: '17.885 / $3.27',
    cng: '+1.27%',
    high: '0.015974',
    low: '0.015974',
    mktCap: '$967.17M',
    vol: '995.26'
  },
  {
    favorite: false,
    pair: 'EOS / STEEM',
    last: '17.885 / $3.27',
    cng: '+1.28%',
    high: '0.015974',
    low: '0.015974',
    mktCap: '$967.17M',
    vol: '995.26'
  },
];

@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor(private http: HttpClient) { }

  loadResults(query: string, params: any): Observable<any> {
    const data = mockTable.filter(item =>
      item.pair.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) !== -1);
    const result = {
      results: data.slice(+params.offset, +params.offset + +params.limit),
      count: data.length
    };

    return of(result);
  }
}
