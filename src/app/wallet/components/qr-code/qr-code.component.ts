import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { IWallet } from '../../../shared/interfaces/wallet.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Devices, MediaBreakpointsService } from '../../../shared/services/media-breakpoints.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrCodeComponent implements OnInit, OnDestroy {
  @Input() wallet: IWallet;
  isDialog;
  private onDestroy$ = new Subject();
  constructor(
    @Optional() public dialogRef: MatDialogRef<QrCodeComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IWallet,
    private breakpointsService: MediaBreakpointsService
  ) { }

  ngOnInit(): void {
    this.isDialog = !!this.dialogRef;
    this.wallet = this.wallet || this.data;
    this.breakpointsService.device.pipe(takeUntil(this.onDestroy$)).subscribe(device => {
      if (device === Devices.MOBILE) {
        this.close();
      }
    });
  }

  close(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }


}
