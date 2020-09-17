import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'timeBefore',
})
export class TimeBeforePipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.datePipe.transform(value, 'dd/MM/yyyy');
  }

}
