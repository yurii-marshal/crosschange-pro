import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarketsService } from '../../../home/services/markets.service';
import { Subject } from 'rxjs';
import { ICurrency } from '../../interfaces/currency.interface';
import { map, takeUntil } from 'rxjs/operators';
import { AddressManagementService } from '../../../profile/services/address-management.service';
import { SsoService } from 'shared-kuailian-lib';

@Component({
  selector: 'app-add-withdraw-address-dialog',
  templateUrl: './add-withdraw-address-dialog.component.html',
  styleUrls: ['./add-withdraw-address-dialog.component.scss']
})
export class AddWithdrawAddressDialogComponent implements OnInit, OnDestroy {
  addAddressStage = 0;
  sendToPhoneClicked = false;
  sendToEmailClicked = false;
  twoFactorMethod: string;

  withdrawalForm: FormGroup;
  securityForm: FormGroup;

  private onDestroyed$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<AddWithdrawAddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private marketsService: MarketsService,
    private addressManagementService: AddressManagementService,
    private sso: SsoService,
  ) {
  }

  ngOnInit(): void {
    this.withdrawalForm = this.fb.group({
      coin: [''],
      wallet_label: ['', Validators.required],
      address: ['', Validators.required],
      tag: [''],
      memo: [''],
      add_to_whitelist: [false],
    });

    this.securityForm = this.fb.group({
      sms: ['', Validators.compose([Validators.required, Validators.pattern('\\d{6}')])],
      email: ['', Validators.compose([Validators.required, Validators.pattern('\\d{6}')])],
      authenticator: ['', Validators.compose([Validators.required, Validators.pattern('\\d{6}')])]
    });

    this.withdrawalForm.get('coin').patchValue(this.data.currencies[0]);

    this.sso.getMe().pipe(
      takeUntil(this.onDestroyed$),
      map(value => value.two_factor_method)
    ).subscribe(method => this.twoFactorMethod = method);
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

  goToSecurityVerification(): void {
    this.addAddressStage = 1;
    Object.keys(this.securityForm.controls).forEach(key => {
      if (key !== this.twoFactorMethod) {
        this.securityForm.get(key).disable();
      }
    });
  }

  sendData(): void {
    this.addAddressStage = 2;

    const data = {
      address: this.withdrawalForm.value,
      verification: {
        type: this.twoFactorMethod,
        code: this.securityForm.get(this.twoFactorMethod)?.value
      }
    };

    this.addressManagementService.addWithdrawalAddress(data).pipe(
      takeUntil(this.onDestroyed$)
    ).subscribe(
      () => {
        setTimeout(() => this.addAddressStage = 3, 3000);
      },
      () => {
        setTimeout(() => this.addAddressStage = this.twoFactorMethod === 'disabled' ? 0 : 1, 3000);
      }
    );
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }
}
