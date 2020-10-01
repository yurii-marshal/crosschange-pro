import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

export enum Devices {
  LAPTOP = 'laptop',
  SMALL_SCREEN = 'small-screen',
  TABLET = 'tablet',
  SMALL_TABLET = 'small-tablet',
  MOBILE = 'mobile'
}

enum Breakpoints {
  LAPTOP = '(min-width: 1440px)',
  SMALL_SCREEN = '(max-width: 1280px)',
  TABLET = '(max-width: 1025px)',
  SMALL_TABLET = '(max-width: 992px)',
  MOBILE = '(max-width: 575px)'
}

@Injectable({
  providedIn: 'root'
})
export class MediaBreakpointsService {
  private readonly device$: BehaviorSubject<Devices> = new BehaviorSubject(Devices.LAPTOP);
  get device(): Observable<Devices> {
    return this.device$.asObservable();
  }
  constructor(
    private breakpointObserver: BreakpointObserver
  ) {

    combineLatest(
      [
        this.breakpointObserver.observe(Breakpoints.SMALL_SCREEN),
        this.breakpointObserver.observe(Breakpoints.TABLET),
        this.breakpointObserver.observe(Breakpoints.SMALL_TABLET),
        this.breakpointObserver.observe(Breakpoints.MOBILE)
      ]
    ).subscribe(([smallScreen,
                       tablet,
                       smallTablet,
                       mobile]) => {
      if (mobile.matches) {
        return this.device$.next(Devices.MOBILE);
      } else if (smallTablet.matches) {
        return this.device$.next(Devices.SMALL_TABLET);
      } else if (tablet.matches) {
        return this.device$.next(Devices.TABLET);
      } else if (smallScreen.matches) {
        return this.device$.next(Devices.SMALL_SCREEN);
      } else {
        return this.device$.next(Devices.LAPTOP);
      }
    });
  }
}
