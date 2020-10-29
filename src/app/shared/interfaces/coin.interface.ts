export interface ICoin {
  key: string; // 'btc', 'eth' etc.
  name: string; // 'Bitcoin'
  is_popular: boolean;
  balance_type?: string; // TODO: check in response
  fee?: number;
}
