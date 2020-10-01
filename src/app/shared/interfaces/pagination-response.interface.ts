export interface IPaginationResponse<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}
