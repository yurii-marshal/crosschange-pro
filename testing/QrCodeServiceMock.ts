import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export class QrCodeServiceMock {

  generateQRFromString(str: string): Observable<string> {
    return of(str).pipe(delay(100));
  }
}
