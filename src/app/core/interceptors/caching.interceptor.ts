import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RequestCacheService } from '../services/request-cache.service';
import { share, tap } from 'rxjs/operators';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  private cachedData = new Map<string, any>();

  constructor(private requestCacheService: RequestCacheService) {
  }

  intercept(httpRequest: HttpRequest<any>, handler: HttpHandler): Observable<any> {
    if (httpRequest.method !== 'GET' || !this.requestCacheService.addedToCache(httpRequest.url)) {
      return handler.handle(httpRequest);
    }

    // Checked if there is cached data for this URI
    const lastResponse = this.cachedData.get(httpRequest.urlWithParams);

    // In case of parallel requests to same URI,
    // return the request already in progress
    // otherwise return the last cached data
    if (lastResponse) {
      return (lastResponse instanceof Observable) ? lastResponse : of(lastResponse.clone());
    }

    // If the request of going through for first time
    // then let the request proceed and cache the response
    const requestHandle = handler.handle(httpRequest).pipe(
      tap((stateEvent) => {
        if (stateEvent instanceof HttpResponse) {
          this.cachedData.set(
            httpRequest.urlWithParams,
            stateEvent.clone()
          );
        }
      }),
      share(),
    );

    // Meanwhile cache the request Observable to handle parallel request
    this.cachedData.set(httpRequest.urlWithParams, requestHandle);

    return requestHandle;
  }
}
