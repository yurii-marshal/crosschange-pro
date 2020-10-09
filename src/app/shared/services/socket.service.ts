/*import { Injectable } from '@angular/core';
import { ApiService, IUser, CentrifugeService, SsoService, SsoUser } from 'shared-kuailian-lib';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private cf: any;

  constructor() {
  }

  connectWebSocket(user) {
    if (this.cf) {
      return;
    }
    this.cf = new Centrifuge(`${environment.centrifugeUrl}/connection/websocket`, {
      subscribeEndpoint: `${environment.apiUrl}/api/v1/centrifugo/subscribe/`
    });

    this.cf.setToken(user.ws_token);

    this.cf.connect();
  }
}*/
