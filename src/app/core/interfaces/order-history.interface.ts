export interface IOrderHistoryData {
  date: Date;
  pair: string;
  type: string;
  side: string;
  average: number;
  executed: number;
  amount: number;
  total: number;
  trigger_condition: number;
}
