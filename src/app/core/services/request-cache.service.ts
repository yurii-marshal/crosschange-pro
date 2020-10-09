import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from 'shared-kuailian-lib';

const CACHE_TIME = 30 * 60 * 1000; // 30min

@Injectable({
  providedIn: 'root'
})
export class RequestCacheService extends ApiService {
  private apiUrls = [];
  private cacheTimers = [];

  public addedToCache(serviceUri: string): any {
    return this.apiUrls.indexOf(serviceUri) > -1;
  }

  public addToCache(serviceUri: string): void {
    if (!this.addedToCache(serviceUri)) {
      const url = `${environment.apiUrl}/${super.version}/${serviceUri}`;

      this.cacheTimers.push(setTimeout(() => this.apiUrls.splice(this.apiUrls.indexOf(url), 1), CACHE_TIME));
      this.apiUrls.push(url);
    }
  }
}
