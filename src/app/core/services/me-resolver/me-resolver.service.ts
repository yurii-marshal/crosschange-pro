import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { SsoUser, SsoService } from 'shared-kuailian-lib';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeResolverService implements Resolve<SsoUser>{

  constructor(
    private ssoService: SsoService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.ssoService.getSwitches();
  }
}
