export enum TransactionStatus {
  NEW = 'new',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  REFUNDED = 'refunded',
  ON_HOLD = 'on_hold',
}

export enum TransactionType {
  SELL = 'sell',
  BUY = 'buy',
  VERIFY = 'verify',
  WITHDRAW = 'withdraw',
  DEPOSIT = 'deposit'
}

export interface ITransactionItem {
  date: string; // operation date
  cryptocurrency: string; // e.g. 'btc', 'eth'
  amount: number; // amount in cryptocurrency
  status: TransactionStatus;
  tx_hash: string;
  type: TransactionType;
}
