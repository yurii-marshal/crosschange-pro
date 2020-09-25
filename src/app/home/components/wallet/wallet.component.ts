import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IBalanceInfo } from 'src/app/shared/interfaces/balance-info.interface';
import { FormControl } from '@angular/forms';
import { TradeType } from '../../../core/interfaces/trade-type.interface';
import { Observable } from 'rxjs';
import { WalletService } from '../../services/wallet.service';

const mockData = [
  {
    coin: 'eur',
    total: '0.00000000',
    available: '0.00000000',
    inOrder: '0.00000000',
    btcValue: '0.00000000',
  },
  {
    coin: 'usd',
    total: '0.00000000',
    available: '0.00000000',
    inOrder: '0.00000000',
    btcValue: '0.00000000',
  }
];

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  displayedColumns: string[] = [
    'coin',
    'total',
    'available',
    'inOrder',
    'btcValue',
    'action'
  ];
  count = 5;

  dataSource: MatTableDataSource<IBalanceInfo> = new MatTableDataSource<IBalanceInfo>(mockData);

  searchInputControl = new FormControl();

  hideNumbers = true;
  tradeTypes$: Observable<TradeType[]>;

  constructor(private walletService: WalletService) {
  }

  ngOnInit(): void {
  }

  getTradeTypes(balanceType: string, currencyType: string): void {
    this.tradeTypes$ = this.walletService.getTradeTypes(balanceType, currencyType);
  }

}
