import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WalletService } from '../../../wallet/services/wallet.service';

@Injectable({
  providedIn: 'root'
})
export class PairsGuard implements CanActivate {

  constructor(private walletService: WalletService, private route: ActivatedRoute) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentPair = this.route.snapshot.queryParams.pair;
    return this.walletService.getCryptoPairs()
      .pipe(
        map((pairs: string[]) => pairs.some(pair => pair === currentPair)),
      );
  }
}
