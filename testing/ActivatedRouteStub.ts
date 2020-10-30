import {
  ActivatedRouteSnapshot,
  convertToParamMap,
  ParamMap,
  Params
} from '@angular/router';
import { ReplaySubject } from 'rxjs';

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteStub {
  private localParamMap: ParamMap;
  private localQueryParams: object;
  private params$ = new ReplaySubject<ParamMap>(1);
  private queryParams$ = new ReplaySubject<object>(1);

  queryParams = this.queryParams$.asObservable();

  constructor(initialParams?: Params, queryParams?: Params) {
    this.setParamMap(initialParams);
    this.setQueryParamMap(queryParams);
  }

  get snapshot(): ActivatedRouteSnapshot {
    const snapshot: Partial<ActivatedRouteSnapshot> = {
      paramMap: this.localParamMap,
      queryParams: this.localQueryParams
    };

    return snapshot as ActivatedRouteSnapshot;
  }

  setParamMap(params?: Params): void {
    const paramMap = convertToParamMap(params);
    this.localParamMap = paramMap;
    this.params$.next(paramMap);
  }

  setQueryParamMap(params?: Params): void {
    const paramMap = convertToParamMap(params);
    /* tslint:disable-next-line */
    this.localQueryParams = paramMap['params'];
    /* tslint:disable-next-line */
    this.queryParams$.next(paramMap['params']);
  }
}
