import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IWallet } from '../../../shared/interfaces/wallet.interface';
import { QrCodeService } from 'shared-kuailian-lib';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrCodeComponent implements OnInit {
  address$: Observable<string> = of('');
  tag$: Observable<string> = of('') ;
  currentWallet: IWallet;
  addressLoaded = false;
  tagLoaded = false;

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
      this.addressLoaded = false;
      this.address$ = this.qrCodeService.generateQRFromString(this.currentWallet.address);
    } else {
      this.address$ = of('');
    }
  }

  setTag(): void {
    if (this.currentWallet && this.currentWallet.destination_tag) {
      this.tagLoaded = false;
      this.tag$ = this.qrCodeService.generateQRFromString(this.currentWallet.destination_tag);
    } else {
      this.tag$ = of('');
    }
  }

  ngOnInit(): void {
  }


}
