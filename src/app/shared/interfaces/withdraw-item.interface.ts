export interface IWithdrawItem {
  date: string; // operation date
  cryptocurrency: string; // e.g. 'btc', 'eth'
  amount: number; // amount in cryptocurrency
  status: string;
  tx_hash: string;
  type: string;
}
