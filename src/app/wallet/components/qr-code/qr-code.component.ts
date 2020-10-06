import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IWallet } from '../../../shared/interfaces/wallet.interface';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrCodeComponent implements OnInit {
  @Input() wallet: IWallet;
  constructor(
  ) { }

  ngOnInit(): void {
  }


}
