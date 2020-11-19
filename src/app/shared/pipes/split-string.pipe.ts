import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitString'
})
export class SplitStringPipe implements PipeTransform {

  transform(value: string, splitter: string, partIndex: number): string {
    if (!splitter || typeof partIndex !== 'number' || !value.split(splitter)[partIndex]) {
      return value;
    }

    return value.split(splitter)[partIndex];
  }

}
