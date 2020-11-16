import { fakeAsync, TestBed } from '@angular/core/testing';

import { ExchangeHelperService } from './exchange-helper.service';
import { ExchangeService } from '../../shared/services/exchange.service';
import { ExchangeServiceMock } from '../../../../testing/ExchangeServiceMock';
import { FormControl, FormGroup } from '@angular/forms';

describe('ExchangeHelperService', () => {
  let service: ExchangeHelperService;
  let form: FormGroup;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ExchangeService, useClass: ExchangeServiceMock
        }
      ]
    });
    service = TestBed.inject(ExchangeHelperService);
    form = new FormGroup({
      f: new FormControl({ currency: 1, amount: 1 }),
      t: new FormControl({ currency: 1, amount: 1 }),
      fromCurrency: new FormControl({ currency: 1, amount: 1 }),
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convertFilter', fakeAsync(() => {
    expect(service.convertFilter(form, 'f', 't')).toEqual(true);

    form.get('f').setValue({ currency: 1, amount: 0 });
    expect(service.convertFilter(form, 'f', 't')).toEqual(true);

    form.get('t').setValue({ currency: 1, amount: 0 });
    expect(service.convertFilter(form, 'f', 't')).toEqual(false);

    form.get('t').setValue({ currency: 0, amount: 0 });
    expect(service.convertFilter(form, 'f', 't')).toEqual(false);

    form.get('t').setValue({ currency: 0, amount: 1 });
    expect(service.convertFilter(form, 'f', 't')).toEqual(false);

    form.get('t').setValue({ currency: 1, amount: 1 });
    expect(service.convertFilter(form, 'f', 't')).toEqual(true);
  }));

  it('should convertFilter', fakeAsync(() => {
    expect(
      service.distinctCurrency([
        {currency: { key: '1'} },
        {currency: { key: '1'} }
      ], [
        {currency: { key: '1'} },
        {currency: { key: '1'} }
      ])
    ).toEqual(true);

    expect(
      service.distinctCurrency([
        {currency: { key: '0'} },
        {currency: { key: '1'} }
      ], [
        {currency: { key: '1'} },
        {currency: { key: '1'} }
      ])
    ).toEqual(false);

    expect(
      service.distinctCurrency([
        {currency: { key: '1'} },
        {currency: { key: '0'} }
      ], [
        {currency: { key: '1'} },
        {currency: { key: '1'} }
      ])
    ).toEqual(false);

    expect(
      service.distinctCurrency([
        {currency: { key: '0'} },
        {currency: { key: '0'} }
      ], [
        {currency: { key: '1'} },
        {currency: { key: '1'} }
      ])
    ).toEqual(false);

  }));

  it('should bothCurrenciesSet', fakeAsync(() => {
    expect(service.bothCurrenciesSet([{currency: '1'}, {currency: '1'}])).toEqual(true);
    expect(service.bothCurrenciesSet([{currency: ''}, {currency: '1'}])).toEqual(false);
    expect(service.bothCurrenciesSet([{currency: '1'}, {currency: ''}])).toEqual(false);
    expect(service.bothCurrenciesSet([undefined, {currency: ''}])).toEqual(false);
    expect(service.bothCurrenciesSet([{currency: '1'}, undefined ])).toEqual(false);
    expect(service.bothCurrenciesSet([{currency: '1'}, {}])).toEqual(false);
    expect(service.bothCurrenciesSet([{}, {currency: ''}])).toEqual(false);
    expect(service.bothCurrenciesSet([undefined, undefined])).toEqual(false);
  }));

  it('should bothCurrenciesSet', () => {
    const exchange = TestBed.inject(ExchangeService);
    form.setValue({
      f: { currency: { key: 'key1' }, amount: 1 },
      t: { currency: { key: 'key2' }, amount: 2 },
      fromCurrency: { currency: { key: 'key1' }, amount: 1 },
    });
    const spy = spyOn(exchange, 'precheck');
    service.preCheckRequest(form, 'f', 't');
    expect(spy).toHaveBeenCalledWith({
      from: 'key1',
      to: 'key2',
      amount: 1,
      baseCurrency: 'key1'
    });
  });


});
