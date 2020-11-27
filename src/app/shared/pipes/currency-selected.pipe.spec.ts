import { CurrencySelectedPipe } from './currency-selected.pipe';
import { ICurrency } from '../interfaces/currency.interface';

const mock: ICurrency[] = [
  {
    key: 'BTC',
    fields: {
      name: 'Bitcoin',
      isFiat: false
    },
  },
  {
    key: 'ETH',
    fields: {
      name: 'Ethereum',
      isFiat: false
    },
  }
];

describe('CurrencySelectedPipe', () => {
  it('create an instance', () => {
    const pipe = new CurrencySelectedPipe();
    expect(pipe).toBeTruthy();
  });

  it('filter selected coin', () => {
    const pipe = new CurrencySelectedPipe();
    const selected = {
      currency: mock[0],
      amount: 0
    };
    const expected = mock.filter((v, i) => i !== 0);
    expect(pipe.transform(mock, selected)).toEqual(expected);
  });

  it('not filter selected coin', () => {
    const pipe = new CurrencySelectedPipe();
    const selected = {
      currency: mock[0],
      amount: 0
    };
    expect(pipe.transform(null, selected)).toEqual([]);
    expect(pipe.transform(mock, null)).toEqual(mock);
    expect(pipe.transform(null, null)).toEqual([]);
  });

});
