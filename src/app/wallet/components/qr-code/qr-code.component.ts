import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IWallet } from '../../../shared/interfaces/wallet.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrCodeComponent implements OnInit {
  @Input() wallet: IWallet;
  imagePath: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    console.log(this.wallet);
    // todo: get wallet QR base64
    this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.wallet.tag);
  }

}
