export interface ICurrency {
  key: string; // BTC, USD
  fields: {
   isFiat: boolean;
  };
}
