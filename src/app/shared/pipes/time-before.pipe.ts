import { Pipe, PipeTransform } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

@Pipe({
  name: 'timeBefore',
})
export class TimeBeforePipe implements PipeTransform {
  transform(value: string): string {
    const d = new Date(value);
    const now = new Date();
    const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));

    const minutes = Math.round(Math.abs(seconds / 60));
    const hours = Math.round(Math.abs(minutes / 60));
    const days = Math.round(Math.abs(hours / 24));
    const months = Math.round(Math.abs(days / 30.416));
    const years = Math.round(Math.abs(days / 365));

    if (Number.isNaN(seconds)) {
      return '';
    } else if (seconds <= 45) {
      return 'time_ago.few_seconds_before';
    } else if (seconds <= 90) {
      return 'time_ago.minute_ago';
    } else if (minutes <= 45) {
      return 'time_ago.minutes_before';
    } else if (minutes <= 90) {
      return 'time_ago.hour_before';
    } else if (hours <= 22) {
      return 'time_ago.hours_before';
    } else if (hours <= 36) {
      return 'time_ago.day_before';
    } else if (days <= 25) {
      return 'time_ago.days_before';
    } else if (days <= 45) {
      return 'time_ago.month_before';
    } else if (days <= 345) {
      return 'time_ago.months_before';
    } else if (days <= 545) {
      return 'time_ago.year_before';
    } else { // (days > 545)
      return 'time_ago.years_before';
    }
  }
}

_([
  'time_ago.few_seconds_before',
  'time_ago.minute_ago',
  'time_ago.minutes_before',
  'time_ago.hour_before',
  'time_ago.hours_before',
  'time_ago.day_before',
  'time_ago.days_before',
  'time_ago.month_before',
  'time_ago.months_before',
  'time_ago.year_before',
  'time_ago.years_before',
]);
