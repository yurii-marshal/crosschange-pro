import { Injectable } from '@angular/core';
import { CentrifugeService, SsoUser } from 'shared-kuailian-lib';
import { environment } from '../../../environments/environment';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { BehaviorSubject } from 'rxjs';
import { IExchangeData } from '../interfaces/exchange-data.interface';
@Injectable({
  providedIn: 'root'
})
export class SocketService extends CentrifugeService {
  tradingPairs$ = new BehaviorSubject<IExchangeData | undefined>(undefined);
  protected cf: any;
  constructor(
    private notifications: NotificationsService
  ) {

    // @ts-ignore
    super(notifications, environment);
  }

  init(userInfo: SsoUser): void {
    this.connectWebSocket(userInfo);
    this.cf.subscribe('trading_pairs', (data) => {
      this.tradingPairs$.next(data);
    });
  }
}
