import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SsoService, SsoUser } from 'shared-kuailian-lib';
import { first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserDataResolver implements Resolve<SsoUser> {

  constructor(
    private router: Router,
    private ssoService: SsoService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SsoUser> {
    return this.ssoService.getMe()
      .pipe(
        tap({
          next: (user: SsoUser) => user,
          error: err => this.router.navigateByUrl('/')
        }),
        first(),
      );
  }

}
