import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SsoService, ISwitches } from 'shared-kuailian-lib';
import { mergeMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

// TODO: move to lib
export interface UpdatedISwitches extends ISwitches {
  show_crosschange_pro?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CanShowProGuard implements CanActivate {

  constructor(
    private ssoService: SsoService
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.ssoService.getSwitches().pipe(
      mergeMap((v: ISwitches) => {
        if ((v as UpdatedISwitches).show_crosschange_pro) {
          return of(true);
        } else {
          window.location.href = environment.kuailianBankUrl;
          return of(false);
        }
      })
    );
  }
}
