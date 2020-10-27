export interface IWithdrawItem {
  date: string; // operation date
  cryptocurrency: string; // e.g. 'btc', 'eth'
  amount: number; // amount in cryptocurrency
  status: string;
  details: string;
}

export interface IWithdraw {
  tag: string;
  amount: number;
  coinSelect: string;
  recipientAddressSelect: string;
}
