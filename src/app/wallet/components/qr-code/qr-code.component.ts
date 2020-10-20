import { Component, Input, OnInit } from '@angular/core';
import { IWallet } from '../../../shared/interfaces/wallet.interface';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
})
export class QrCodeComponent implements OnInit {
  code: string;

  constructor() {
  }

  @Input() set wallet(value: IWallet) {
    console.log(value);
  }

  ngOnInit(): void {
  }

}
