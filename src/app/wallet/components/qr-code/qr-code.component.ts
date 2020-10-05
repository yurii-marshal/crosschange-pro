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
  constructor(
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }


}
