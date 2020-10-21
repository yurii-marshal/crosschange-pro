import { Component, Input, OnInit } from '@angular/core';
import { IWallet } from '../../../shared/interfaces/wallet.interface';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
})
export class QrCodeComponent implements OnInit {
  code: string;
  currentWallet: IWallet;

  constructor() {
  }

  @Input() set wallet(value: IWallet) {
    this.currentWallet = value;
    this.getQRCode(value);
  }

  ngOnInit(): void {
  }

  private getQRCode(value): void {
    this.code = value.tag;
  }

}
