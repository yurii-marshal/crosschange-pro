import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, mode: string): SafeResourceUrl | SafeHtml | SafeUrl {
    switch (mode) {
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'base64':
        return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + value);
    }

    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
