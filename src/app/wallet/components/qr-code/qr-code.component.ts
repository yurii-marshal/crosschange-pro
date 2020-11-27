import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IWallet } from '../../../shared/interfaces/wallet.interface';
import { QrCodeService } from 'shared-kuailian-lib';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrCodeComponent implements OnInit {
  address$: Subject<string> = new Subject(); // subjects are used to prevent blinking on load
  tag$: Subject<string> = new Subject();
  currentWallet: IWallet;

  @Input() set wallet(value: IWallet) {
    this.currentWallet = value;
    this.setAddress();
    this.setTag();

  }

  constructor(
    private qrCodeService: QrCodeService,
  ) {
  }

  setAddress(): void {
    if (this.currentWallet && this.currentWallet.cryptocurrency) {
      this.qrCodeService.generateQRFromString(this.currentWallet.address).pipe(take(1)).subscribe(v => {
        this.address$.next(v);
      });
    } else {
      this.address$.next('');
    }
  }

  setTag(): void {
    if (this.currentWallet && this.currentWallet.destination_tag) {
      this.qrCodeService.generateQRFromString(this.currentWallet.destination_tag).pipe(take(1)).subscribe(v => {
        this.tag$.next(v);
      });
    } else {
      this.tag$.next('');
    }
  }

  ngOnInit(): void {
  }

}
