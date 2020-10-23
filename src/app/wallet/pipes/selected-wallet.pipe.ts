import { Pipe, PipeTransform } from '@angular/core';
import { IWallet } from '../../shared/interfaces/wallet.interface';
import { ICoin } from '../../shared/interfaces/coin.interface';

@Pipe({
  name: 'selectedWallet'
})
export class SelectedWalletPipe implements PipeTransform {

  transform(value: IWallet[], filter: ICoin): IWallet[] {
    if (!value || !filter) {
      return value;
    }
    return value.filter(v => v.cryptocurrency.toLowerCase() === filter.key.toLowerCase());
  }

}
