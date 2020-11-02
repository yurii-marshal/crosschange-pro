import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, startWith, switchMap, take, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AddressManagementService } from '../../services/address-management.service';
import { SelectionModel } from '@angular/cdk/collections';
import { IWalletAddress } from '../../../shared/interfaces/address.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../../../shared/components/confirmation/confirmation.component';
import { TranslatePipe } from '@ngx-translate/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { AddWithdrawAddressDialogComponent } from '../../../shared/components/add-withdraw-address-dialog/add-withdraw-address-dialog.component';

@Component({
  selector: 'app-address-management',
  templateUrl: './address-management.component.html',
  styleUrls: ['./address-management.component.scss', './../../../wallet/components/wallet/wallet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressManagementComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'checkboxes',
    'coin',
    'wallet_label',
    'address',
    'memo_tag',
    'is_whitelisted',
    'action',
  ];
  searchInputControl = new FormControl();

  dataSource$: BehaviorSubject<MatTableDataSource<IWalletAddress>> = new BehaviorSubject(new MatTableDataSource([]));
  count = 0;
  enableWhitelist$ = new BehaviorSubject<boolean>(false);
  showWhitelistedOnly$ = new BehaviorSubject<boolean>(false);

  onDestroy$ = new Subject<void>();

  selection = new SelectionModel<IWalletAddress>(true, []);

  constructor(
    private route: ActivatedRoute,
    private addressManagementService: AddressManagementService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    combineLatest([
      this.searchInputControl.valueChanges.pipe(startWith(''), debounceTime(500), distinctUntilChanged()),
      this.route.queryParams,
      this.showWhitelistedOnly$
    ]).pipe(
      takeUntil(this.onDestroy$),
      switchMap(([search, params, whitelistedOnly]) => {
        return this.addressManagementService.getWalletAddressesList(search, params, whitelistedOnly.toString());
      }),
    ).subscribe((addresses) => {
        this.count = addresses.count;
        this.dataSource$.next(new MatTableDataSource(addresses.results));
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  addWithdrawAddress(): void {
    const dialogRef = this.dialog.open(AddWithdrawAddressDialogComponent, {
      width: '400px',
      panelClass: 'confirmation',
      data: {

      }
    });
  }

  addToWhitelist(): void {
    const items = this.selection.selected.filter(item => !item.isWhitelisted).map(item => item.id);

    this.addressManagementService.addToWhitelist(items).subscribe(() => {
      this.dataSource$.getValue().data.filter(item => items.includes(item.id)).map(item => item.isWhitelisted = !item.isWhitelisted);
      this.selection.clear();
    });
  }

  removeFromWhitelist(): void {
    const items = this.selection.selected.filter(item => item.isWhitelisted).map(item => item.id);

    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '400px',
      panelClass: 'confirmation',
      data: {
        label: 'profile_page.remove_from_whitelist',
        text: 'profile_page.sure_remove',
        buttonText: 'profile_page.remove',
        buttonColor: 'color-brand',
        icon: 'whitelist'
      }
    }).afterClosed().pipe(
      switchMap((value: boolean) => {
        if (value) {
          return this.addressManagementService.removeFromWhitelist(items);
        }
      })
    ).subscribe(() => {
      this.dataSource$.getValue().data.filter(item => items.includes(item.id)).map(item => item.isWhitelisted = !item.isWhitelisted);
      this.selection.clear();
      this.cdr.detectChanges();
    });
  }

  deleteItems(item?: IWalletAddress): void {
    const items = item ? [item.id] : this.selection.selected.map(vl => vl.id);

    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '400px',
      panelClass: 'confirmation',
      data: {
        label: 'profile_page.delete_address',
        text: 'profile_page.sure_delete',
        buttonText: 'profile_page.delete',
        buttonColor: 'color-trading-red',
        icon: 'trash'
      }
    }).afterClosed().pipe(
      take(1),
      switchMap((value: boolean) => {
        if (value) {
          return this.addressManagementService.deleteItems(items);
        } else {
          throw new Error('Action not confirmed!');
        }
      })
    ).subscribe(() => {
      const result = this.dataSource$.getValue().data.filter(value => !items.includes(value.id));

      this.dataSource$.next(new MatTableDataSource(result));
      this.selection.clear();
    });
  }

  setWhitelisted(element: IWalletAddress): void {
    element.isWhitelisted = !element.isWhitelisted;
  }

  toggleWhitelistEnable(): void {
    const config = {
      width: '400px',
      panelClass: 'confirmation',
      data: {}
    };

    if (this.enableWhitelist$.getValue()) {
      config.data = {
        label: 'profile_page.sure_turn_off_whitelist',
        text: 'profile_page.after_turning_off',
        buttonText: 'profile_page.turn_off',
        buttonColor: 'color-brand',
        icon: 'whitelist'
      };
    } else {
      config.data = {
        label: 'profile_page.sure_turn_on_whitelist',
        text: 'profile_page.after_turning_on',
        buttonText: 'profile_page.turn_on',
        buttonColor: 'color-brand',
        icon: 'whitelist'
      };
    }

    const dialogRef = this.dialog.open(ConfirmationComponent, config).afterClosed().pipe(
      switchMap((value: boolean) => {
        if (value) {
          return this.addressManagementService.toggleWhitelistEnable();
        }
      })
    ).subscribe(() => this.enableWhitelist$.next(!this.enableWhitelist$.getValue()));
  }

  toggleWhitelistedOnly(): void {
    this.showWhitelistedOnly$.next(!this.showWhitelistedOnly$.getValue());
  }

  isWhitelistedItems(): boolean {
    return this.selection.selected.some((item: IWalletAddress) => !item.isWhitelisted);
  }

  isNotWhitelistedItems(): boolean {
    return this.selection.selected.some((item: IWalletAddress) => item.isWhitelisted);
  }

  isAllSelected(): boolean {
    return this.selection.selected.length === this.dataSource$.getValue().data.length;
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource$.getValue().data.forEach(row => this.selection.select(row));
  }
}

_([
  'profile_page.remove_from_whitelist',
  'profile_page.sure_remove',
  'profile_page.remove',
  'profile_page.delete_address',
  'profile_page.sure_delete',
  'profile_page.delete',
  'profile_page.sure_turn_off_whitelist',
  'profile_page.after_turning_off',
  'profile_page.turn_off',
  'profile_page.sure_turn_on_whitelist',
  'profile_page.after_turning_on',
  'profile_page.turn_on'
]);
