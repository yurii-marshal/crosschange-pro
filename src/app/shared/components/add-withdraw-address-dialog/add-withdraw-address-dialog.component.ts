import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarketsService } from '../../../home/services/markets.service';
import { Observable, Subject } from 'rxjs';
import { ICurrency } from '../../interfaces/currency.interface';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-withdraw-address-dialog',
  templateUrl: './add-withdraw-address-dialog.component.html',
  styleUrls: ['./add-withdraw-address-dialog.component.scss']
})
export class AddWithdrawAddressDialogComponent implements OnInit, OnDestroy {
  addAddressStage = 0;

  withdrawalForm: FormGroup;
  securityForm: FormGroup;

  currencies$: Observable<ICurrency[]>;

  private onDestroyed$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<AddWithdrawAddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private marketsService: MarketsService
  ) { }

  ngOnInit(): void {
    this.currencies$ = this.marketsService.loadDropdownData().pipe(
      map(currency => currency.filter(item => !item.fields.isFiat))
    );

    this.withdrawalForm = this.fb.group({
      coin: [''],
      wallet_label: ['', Validators.required],
      address: ['', Validators.required],
      tag: [''],
      memo: [''],
      add_to_whitelist: [false],
    });

    this.currencies$.pipe(
      takeUntil(this.onDestroyed$)
    ).subscribe(items => this.withdrawalForm.get('coin').patchValue(items[0]));
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  setCurrency(item: ICurrency): void {
    this.withdrawalForm.get('coin').patchValue(item);
  }

  compare(object1: ICurrency, object2: ICurrency): boolean {
    return object1 && object2 && object1.key === object2.key;
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }
}
