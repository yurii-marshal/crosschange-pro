import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toggleSecretText'
})
export class ToggleSecretTextPipe implements PipeTransform {

  transform(value: string, replace = true): string {
    if (value && replace) {
      return '*'.repeat(value.length);
    }

    return value;
  }

}
