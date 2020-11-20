export interface ITradePair {
  pair: string;
  lastPrice: {
    price: number;
    exchanged: number;
  };
  change: number;
}

export enum ITradeCoinType {
  All = 'all',
  Cross = 'cross',
  Isolated = 'isolated',
}
