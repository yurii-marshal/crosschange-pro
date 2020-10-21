export interface ICurrency {
  key: string; // BTC, USD
  fields: {
    name: string;
    isFiat: boolean;
  };
}
