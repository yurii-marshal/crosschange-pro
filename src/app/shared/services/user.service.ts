import { Injectable, Injector } from '@angular/core';
import { ApiService, CentrifugeService, SsoService, SsoUser } from 'shared-kuailian-lib';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {
  private user: SsoUser;
  constructor(
    protected injector: Injector,
    private centrifugeService: CentrifugeService,
    private sso: SsoService
  ) {
    super(injector);
  }

  getUserInfo(refresh?: boolean): Observable<SsoUser> {
    if (this.user && !refresh) {
      return of(this.user);
    }

    return this.sso.getMe().pipe(
      map((userInfo: SsoUser) => {
        this.user = {
          ...userInfo,
        };
        this.centrifugeService.connectWebSocket(userInfo);
        return this.user;
      })
    );
  }
}
