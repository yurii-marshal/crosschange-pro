import { Pipe, PipeTransform } from '@angular/core';
import { IWallet } from '../../shared/interfaces/wallet.interface';
import { ICurrency } from '../../shared/interfaces/currency.interface';

@Pipe({
  name: 'selectedWalletBalance'
})
export class SelectedWalletBalancePipe implements PipeTransform {

  transform(selectedCurrencyValue: { currency: null | ICurrency, amount: number }, wallets: IWallet[]): number {
    if (!selectedCurrencyValue || !selectedCurrencyValue.currency || !wallets || !wallets.length) {
      return 0;
    }
    const wallet = wallets.filter(v => v.cryptocurrency === selectedCurrencyValue.currency.key).shift();
    if (!wallet) {
      return 0;
    }
    return wallet.balance.available;
  }

}
