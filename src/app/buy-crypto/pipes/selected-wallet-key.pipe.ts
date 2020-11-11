import { Pipe, PipeTransform } from '@angular/core';
import { IWallet } from '../../shared/interfaces/wallet.interface';
import { ICurrency } from '../../shared/interfaces/currency.interface';

@Pipe({
  name: 'selectedWalletKey'
})
export class SelectedWalletKeyPipe implements PipeTransform {

  transform(selectedCurrencyValue: { currency: null | ICurrency, amount: number }, wallets: IWallet[]): string {
    if (!selectedCurrencyValue || !selectedCurrencyValue.currency || !wallets || !wallets.length) {
      return '';
    }
    const wallet = wallets.filter(v => v.cryptocurrency === selectedCurrencyValue.currency.key).shift();
    if (!wallet) {
      return '';
    }
    return wallet.cryptocurrency.toUpperCase();
  }

}
