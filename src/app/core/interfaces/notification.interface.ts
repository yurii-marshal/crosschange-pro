export interface Notification {
  header: string,
  message: string,
  date: Date,
  active: boolean,
  category?: string,
}
