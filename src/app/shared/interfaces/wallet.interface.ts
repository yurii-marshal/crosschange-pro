export interface IWallet {
  cryptocurrency: string; // 'btc', 'eth' etc.
  address: string; // wallet address
  tag: string; // used for e.g. in Ripple.
  id: number;
  balance: {
    total: number;
    available: number;
    in_order: number;
    btc: number; // value in btc
  };
}
