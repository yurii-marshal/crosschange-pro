import { Injectable } from '@angular/core';
import { ApiService, IUser, CentrifugeService, SsoService, SsoUser } from 'shared-kuailian-lib';
import { environment } from '../../../environments/environment';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { BehaviorSubject } from 'rxjs';
import { IExchangeData } from '../interfaces/exchange-data.interface';
@Injectable({
  providedIn: 'root'
})
export class SocketService extends CentrifugeService {
  tradingPairs$ = new BehaviorSubject<IExchangeData | undefined>(undefined);
  constructor(
    private notifications: NotificationsService
  ) {

    // @ts-ignore
    super(notifications, environment);
    this.cf.subscribe('trading_pairs', (data) => this.tradingPairs$.next(data));
  }
}
