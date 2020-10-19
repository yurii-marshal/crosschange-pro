export interface ICurrency {
  key: string;
  fields: {
    name: string;
    isFiat: boolean;
  };
}
