import { ICommissionCoin } from './static-pages.service';

export const commissionsData: ICommissionCoin[] = [
  { // network: BTC
    cryptocurrency: 'BTC',
    withdrawal_minimum: 0.001,
    withdraw_fee: 0.0004,
    deposit_fee: 'Free',
    name: 'Bitcoin'
  },
  { // network: bch
    cryptocurrency: 'BCH',
    withdrawal_minimum: 0.002,
    withdraw_fee: 0.001,
    deposit_fee: 'Free',
    name: 'Bitcoin Cash'
  },
  {
    cryptocurrency: 'DASH',
    withdrawal_minimum: 0.004,
    withdraw_fee: 0.002,
    deposit_fee: 'Free',
    name: 'Dash'
  },
  { // network: erc20
    cryptocurrency: 'ETH',
    withdrawal_minimum: 0.01,
    withdraw_fee: 0.005,
    deposit_fee: 'Free',
    name: 'Ethereum'
  },
  { // network: ltc
    cryptocurrency: 'LTC',
    withdrawal_minimum: 0.002,
    withdraw_fee: 0.0001,
    deposit_fee: 'Free',
    name: 'Litecoin'
  },
  { // network: xrp
    cryptocurrency: 'XRP',
    withdrawal_minimum: 0.5,
    withdraw_fee: 0.25,
    deposit_fee: 'Free',
    name: 'Ripple'
  },
  { // network: erc20
    cryptocurrency: 'USDT',
    withdrawal_minimum: 10,
    withdraw_fee: 3,
    deposit_fee: 'Free',
    name: 'Tether'
  },
  { // network: Tezos
    cryptocurrency: 'XTZ',
    withdrawal_minimum: 1,
    withdraw_fee: 0.5,
    deposit_fee: 'Free',
    name: 'Tezos'
  },
  { // network: erc20
    cryptocurrency: 'USDC',
    withdrawal_minimum: 6.5,
    withdraw_fee: 3.25,
    deposit_fee: 'Free',
    name: 'USD Coin'
  },
];
