import { Injectable, Injector } from '@angular/core';
import { ApiService, CentrifugeService, SsoService, SsoUser } from 'shared-kuailian-lib';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SocketService } from './socket.service';
@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {
  private user: SsoUser;
  constructor(
    protected injector: Injector,
    private sso: SsoService,
    private socket: SocketService
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
        return this.user;
      })
    );
  }
}
