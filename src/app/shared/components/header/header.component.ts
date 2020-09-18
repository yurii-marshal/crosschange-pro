import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SsoService, SessionService } from 'shared-kuailian-lib';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  get isLoggedIn(): boolean {
    return this.sessionService.isAuthenticated;
  }

  constructor(
    private ssoService: SsoService,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.ssoService.logout().pipe(
      tap(() => this.sessionService.removeSession())
    ).subscribe();
  }

}
