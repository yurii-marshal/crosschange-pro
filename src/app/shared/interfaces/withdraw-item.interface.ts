export interface IWithdrawItem {
  date: string; // operation date
  cryptocurrency: string; // e.g. 'btc', 'eth'
  amount: number; // amount in cryptocurrency
  status: string;
  hash: string;
}

export interface IWithdraw {
  tag: string;
  amount: number;
  coin: string;
  address: string;
}
