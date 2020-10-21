export interface Notification {
  header: string;
  message: string;
  date: Date;
  isNew: boolean;
  category?: string;
}
