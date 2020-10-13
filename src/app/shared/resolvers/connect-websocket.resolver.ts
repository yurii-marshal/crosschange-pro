import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { SsoUser } from 'shared-kuailian-lib';
import { map } from 'rxjs/operators';
import { SocketService } from '../services/socket.service';
@Injectable({
  providedIn: 'root'
})
export class ConnectWebsocketResolver  implements Resolve<SsoUser> {

  constructor(
    private user: UserService,
    private socket: SocketService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SsoUser> | Promise<SsoUser> | SsoUser {
   return this.user.getUserInfo().pipe(
     map((user) => {
         this.socket.init(user);
         return user;
       }
     ));
  }
}
