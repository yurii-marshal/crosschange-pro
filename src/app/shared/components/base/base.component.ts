import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit, OnDestroy {
  onDestroy = new Subject<void>();
  headerClass = '';
  footerClass = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.router.events.pipe(
      takeUntil(this.onDestroy),
      filter((e: RouterEvent) => e instanceof NavigationEnd),
      map(() => this.extractCurrentRoute()),
      mergeMap(route => route.data)
    )
      .subscribe(data => {
        this.headerClass = data && data.headerClass ? data.headerClass : '';
        this.footerClass = data && data.footerClass ? data.footerClass : '';
      });
  }

  ngOnInit(): void {
  }

  extractCurrentRoute(): ActivatedRoute {
    let route = this.activatedRoute.firstChild;
    let child = route;

    while (child) {
      if (child.firstChild) {
        child = child.firstChild;
        route = child;
      } else {
        child = null;
      }
    }

    return route;
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

}
