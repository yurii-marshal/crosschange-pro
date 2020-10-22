import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AddressManagementService } from '../../services/address-management.service';
import { SelectionModel } from '@angular/cdk/collections';
import { IAddress } from '../../../shared/interfaces/address.interface';

@Component({
  selector: 'app-address-management',
  templateUrl: './address-management.component.html',
  styleUrls: ['./address-management.component.scss', './../../../wallet/components/wallet/wallet.component.scss']
})
export class AddressManagementComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'checkboxes',
    'coin',
    'wallet_label',
    'address',
    'memo_tag',
    'whitelist',
    'action',
  ];
  searchInputControl = new FormControl();

  dataSource: MatTableDataSource<IAddress>;
  count = 0;
  showWhitelistedOnly$ = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('showWhitelistedOnly')) || false);

  onDestroy$ = new Subject<void>();

  selection = new SelectionModel<IAddress>(true, []);

  constructor(
    private route: ActivatedRoute,
    private addressManagementService: AddressManagementService,
  ) {
  }

  ngOnInit(): void {
    combineLatest([
      this.searchInputControl.valueChanges
        .pipe(
          takeUntil(this.onDestroy$),
          startWith(''),
          debounceTime(500),
          distinctUntilChanged(),
        ),
      this.route.queryParams,
      this.showWhitelistedOnly$,
    ]).pipe(
      takeUntil(this.onDestroy$),
      switchMap(([search, params, showWhitelistedOnly]) => {
        return this.addressManagementService.getAddressList({...params, ...{search}, ...{showWhitelistedOnly}});
      }),
      share(),
    )
      .subscribe((addresses) => {
        this.count = addresses.count;
        this.dataSource = new MatTableDataSource(addresses.results);
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  addToWhitelist(): void {
  }

  removeFromWhitelist(): void {
  }

  deleteItems(items?): void {
  }

  setWhitelist(element: IAddress): void {
    element.whitelist = !element.whitelist;
  }

  toggleWhitelistedOnly(): void {
    this.showWhitelistedOnly$.next(!this.showWhitelistedOnly$.getValue());
    localStorage.setItem('showWhitelistedOnly', JSON.stringify(this.showWhitelistedOnly$.getValue()));
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

}
