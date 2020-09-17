import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment } from '@angular/router';
import { SessionService } from 'shared-kuailian-lib';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthChildrenGuard implements CanLoad {

  constructor(private sessionService: SessionService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | boolean {
    if (!this.sessionService.isAuthenticated) {
      this.sessionService.forceLoginRedirect();
    }

    return of(this.sessionService.isAuthenticated);
  }
}
