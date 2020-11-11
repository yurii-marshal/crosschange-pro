import { SelectedWalletKeyPipe } from './selected-wallet-key.pipe';
import { currenciesMock } from '../../../../testing/ExchangeServiceMock';
import { walletsMock } from '../../../../testing/WalletServiceMock';

describe('SelectedWalletKeyPipe', () => {
  it('create an instance', () => {
    const pipe = new SelectedWalletKeyPipe();
    expect(pipe).toBeTruthy();
  });

  it('get balance of selected wallet', () => {
    const pipe = new SelectedWalletKeyPipe();
    const btcIdx = currenciesMock.findIndex(v => v.key === 'btc');
    const wallets = [].concat(walletsMock);
    expect(pipe.transform({currency: currenciesMock[btcIdx], amount: 0 }, wallets)).toEqual('BTC');
  });

  it('get return "" of something is missing', () => {
    const pipe = new SelectedWalletKeyPipe();
    expect(pipe.transform(null, walletsMock)).toEqual('');
    expect(pipe.transform({currency: currenciesMock[0], amount: 0 }, [])).toEqual('');
    expect(pipe.transform(null, [])).toEqual('');
    const btc = currenciesMock.find(v => v.key === 'btc');
    const wallets = walletsMock.filter(v => v.cryptocurrency !== 'btc');
    expect(pipe.transform({ currency: btc, amount: 0 }, wallets)).toEqual('');
  });
});
