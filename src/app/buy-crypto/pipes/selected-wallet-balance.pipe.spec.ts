import { SelectedWalletBalancePipe } from './selected-wallet-balance.pipe';
import { currenciesMock } from '../../../../testing/ExchangeServiceMock';
import { walletsMock } from '../../../../testing/WalletServiceMock';

describe('SelectedWalletBalancePipe', () => {
  it('create an instance', () => {
    const pipe = new SelectedWalletBalancePipe();
    expect(pipe).toBeTruthy();
  });

  it('get balance of selected wallet', () => {
    const pipe = new SelectedWalletBalancePipe();
    const btcIdx = currenciesMock.findIndex(v => v.key === 'btc');
    const wallets = [].concat(walletsMock).map(v => {
      if (v.cryptocurrency === 'btc') {
        v.balance.available = 1000;
      }
      return v;
    });
    expect(pipe.transform({currency: currenciesMock[btcIdx], amount: 0 }, wallets)).toEqual(1000);
  });

  it('get return 0 of something is missing', () => {
    const pipe = new SelectedWalletBalancePipe();
    expect(pipe.transform(null, walletsMock)).toEqual(0);
    expect(pipe.transform({currency: currenciesMock[0], amount: 0 }, [])).toEqual(0);
    expect(pipe.transform(null, [])).toEqual(0);
    const btc = currenciesMock.find(v => v.key === 'btc');
    const wallets = walletsMock.filter(v => v.cryptocurrency !== 'btc');
    expect(pipe.transform({currency: btc, amount: 0}, wallets)).toEqual(0);
  });

});
