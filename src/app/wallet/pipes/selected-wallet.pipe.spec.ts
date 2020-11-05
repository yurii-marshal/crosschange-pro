import { SelectedWalletPipe } from './selected-wallet.pipe';
import { walletsMock } from '../../../../testing/WalletServiceMock';
import { coinsMock } from '../../../../testing/CoinServiceMock';

describe('SelectedWalletPipe', () => {
  it('create an instance', () => {
    const pipe = new SelectedWalletPipe();
    expect(pipe).toBeTruthy();
  });

  it('should filter values', () => {
    const pipe = new SelectedWalletPipe();
    const coin = coinsMock[0];
    const res = pipe.transform(walletsMock, coin);
    expect(res).toBeTruthy();
    expect(res.cryptocurrency).toEqual(coin.key);
  });

  it('should return raw values', () => {
    const pipe = new SelectedWalletPipe();
    const coin = coinsMock[0];
    expect(pipe.transform([], coin)).toEqual(undefined);
    expect(pipe.transform(walletsMock, undefined)).toEqual(undefined);
    expect(pipe.transform(undefined, undefined)).toEqual(undefined);
  });
});
