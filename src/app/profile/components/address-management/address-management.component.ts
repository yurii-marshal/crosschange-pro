import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AddressManagementService } from '../../services/address-management.service';
import { SelectionModel } from '@angular/cdk/collections';
import { IWalletAddress } from '../../../shared/interfaces/address.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../../../shared/components/confirmation/confirmation.component';
import { TranslatePipe } from '@ngx-translate/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

@Component({
  selector: 'app-address-management',
  templateUrl: './address-management.component.html',
  styleUrls: ['./address-management.component.scss', './../../../wallet/components/wallet/wallet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TranslatePipe]
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
    private translate: TranslatePipe,
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
        label: this.translate.transform('profile_page.remove_from_whitelist'),
        text: this.translate.transform('profile_page.sure_remove'),
        buttonText: this.translate.transform('profile_page.remove'),
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
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '400px',
      panelClass: 'confirmation',
      data: {
        label: this.translate.transform('profile_page.delete_address'),
        text: this.translate.transform('profile_page.sure_delete'),
        buttonText: this.translate.transform('profile_page.delete'),
        buttonColor: 'color-trading-red',
        icon: 'trash'
      }
    }).afterClosed().pipe(
      switchMap((value: boolean) => {
        if (value) {
          return item ?
            this.addressManagementService.deleteItems([item.id]) :
            this.addressManagementService.deleteItems(this.selection.selected.map(vl => vl.id));
        }
      })
    ).subscribe(vl => console.log(vl));
  }

  setWhitelist(element: IWalletAddress): void {
    element.isWhitelisted = !element.isWhitelisted;
  }

  toggleWhitelistEnable(): void {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '400px',
      panelClass: 'confirmation',
      data: {
        label: this.translate.transform('profile_page.sure_turn_off_whitelist'),
        text: this.translate.transform('profile_page.after_turning_off'),
        buttonText: this.translate.transform('profile_page.turn_off'),
        buttonColor: 'color-brand',
        icon: 'whitelist'
      }
    }).afterClosed().pipe(
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
  'profile_page.turn_off'
]);
