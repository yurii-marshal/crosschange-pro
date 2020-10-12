import {
  ActivatedRouteSnapshot,
  convertToParamMap,
  ParamMap,
  Params } from '@angular/router';
import { ReplaySubject } from 'rxjs';

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteStub {
  private localParamMap: ParamMap;
  private localQueryParams: ParamMap;
  private params$ = new ReplaySubject<ParamMap>(1);
  private queryParams$ = new ReplaySubject<ParamMap>(1);

  queryParams = this.queryParams$.asObservable();

  get snapshot(): ActivatedRouteSnapshot {
    const snapshot: Partial<ActivatedRouteSnapshot> = {
      paramMap: this.localParamMap,
      queryParams: this.localQueryParams
    };

    return snapshot as ActivatedRouteSnapshot;
  }

  constructor(initialParams?: Params, queryParams?: Params) {
    this.setParamMap(initialParams);
    this.setQueryParamMap(queryParams);
  }

  setParamMap(params?: Params): void {
    const paramMap = convertToParamMap(params);
    this.localParamMap = paramMap;
    this.params$.next(paramMap);
  }

  setQueryParamMap(params?: Params): void {
    const paramMap = convertToParamMap(params);
    this.localQueryParams = paramMap;
    this.queryParams$.next(paramMap);
  }
}
