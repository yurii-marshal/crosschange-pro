import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subject } from 'rxjs';
import {UserService} from '../../services/user.service';
import {SocketService} from '../../services/socket.service';

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
    private user: UserService,
    private socket: SocketService
  ) {
    this.router.events.pipe(
      takeUntil(this.onDestroy),
      filter((e: RouterEvent) => e instanceof NavigationEnd),
      map(() => this.extractCurrentRoute()),
      mergeMap(route => route.data)
    )
      .subscribe(data => {
        this.headerClass = data && data.headerClass;
        this.footerClass = data && data.footerClass;
      });
  }

  ngOnInit(): void {
    this.user.getUserInfo().pipe(
      map((user) => {
          this.socket.init(user);
          return user;
        }
      )).subscribe(() => {});
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

  closeMenuMobile(MenuMobile): void {
    MenuMobile.close();
    document.body.style.overflow = 'auto';
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

}
