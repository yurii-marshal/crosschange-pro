import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencySelectComponent } from './currency-select.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { environment } from '../../../../environments/environment';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { currenciesMock, ExchangeServiceMock } from '../../../../../testing/ExchangeServiceMock';
import { ExchangeService } from '../../services/exchange.service';
import { take } from 'rxjs/operators';
import { MainTestHelper } from '../../../../../testing/MainTestHelper';
import {CurrencySelectedPipe} from '../../pipes/currency-selected.pipe';

@Component({
  selector: 'app-test-host',
  template: '<app-currency-select [formControl]="ctrl" ngDefaultControl></app-currency-select>'
})
class TestHostComponent {
  @ViewChild(CurrencySelectComponent)
  public coinSelect: CurrencySelectComponent;
  public ctrl: FormControl = new FormControl({value: null, disabled: false});
}

describe('CurrencySelectComponent', () => {
  let component: CurrencySelectComponent;
  let testHostComponent: TestHostComponent;
  let fixture: ComponentFixture<CurrencySelectComponent>;
  let hostFixture: ComponentFixture<TestHostComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CurrencySelectComponent,
        CurrencySelectedPipe
      ],
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: ENVIRONMENT,
          useValue: environment as IEnvironment
        },
        {provide: MatIconRegistry, useClass: FakeMatIconRegistry},
        {provide: ExchangeService, useClass: ExchangeServiceMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    hostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch currencies', (done) => {
    component.currenciesFiltered$.subscribe(res => {
      expect(res).toEqual(currenciesMock);
      done();
    });
    component.ngOnInit();
  });

  it('should set value', (done) => {
    component.ngOnInit();
    component.currenciesFiltered$.subscribe(res => {
      component.writeValue({ currency: res[0], amount: 1 });
      expect(component.selected$.getValue()).toEqual(res[0]);
      expect(component.value.amount).toEqual(1);
      done();
    });
  });

  it('should get/set value as a form control',  (done) => {
    testHostComponent.ctrl.valueChanges.pipe(take(1)).subscribe(v => {
      expect(v).toEqual({currency: currenciesMock[btcIdx], amount: 1});
      done();
    });
    const btcIdx = currenciesMock.findIndex((v) => v.key === 'btc');
    testHostComponent.ctrl.setValue({currency: currenciesMock[btcIdx], amount: 1});
    hostFixture.detectChanges();
  });

  it('should have Bitcoin selected in template', (done) => {
    component.currenciesFiltered$.subscribe(res => {
      const switcher = fixture.elementRef.nativeElement.querySelector('.switcher');
      MainTestHelper.click(switcher);
      fixture.detectChanges();
      const menuItems = fixture.elementRef.nativeElement.querySelectorAll('.menu-item');
      const btcIdx = currenciesMock.findIndex((v) => v.key === 'btc');
      MainTestHelper.click(menuItems[btcIdx]);
      fixture.detectChanges();
      expect(component.selected$.getValue().key).toEqual('btc');
      const title = fixture.elementRef.nativeElement.querySelector('.coin-title');
      expect(title.innerText).toEqual('Bitcoin');
      done();
    });
  });


  it('should selected value in variable', (done) => {
    component.currenciesFiltered$.subscribe(res => {
      const switcher = fixture.elementRef.nativeElement.querySelector('.switcher');
      expect(component.opened).toEqual(false);
      MainTestHelper.click(switcher);
      fixture.detectChanges();
      expect(component.opened).toEqual(true);
      const menu: HTMLElement = fixture.elementRef.nativeElement.querySelector('.coins-menu');
      expect(menu.classList.contains('visible')).toEqual(true);
      const menuItems = fixture.elementRef.nativeElement.querySelectorAll('.menu-item');
      MainTestHelper.click(menuItems[1]);
      expect(component.selected$.getValue()).toEqual(res[1]);
      done();
    });
  });

  it('should perform search in dropdown', async () => {
    await fixture.whenStable();
    const switcher = fixture.elementRef.nativeElement.querySelector('.switcher');
    MainTestHelper.click(switcher);
    fixture.detectChanges();
    const input = fixture.elementRef.nativeElement.querySelector('.currency-search');
    input.value = 'bt';
    input.dispatchEvent(new Event('keyup'));
    fixture.detectChanges();
    await fixture.whenStable();
    let menuItems = fixture.elementRef.nativeElement.querySelectorAll('.menu-item');
    expect(menuItems.length).toEqual(1);
    expect(menuItems[0].querySelector('.coin-title').innerText).toEqual('BTC');
    input.value = '';
    input.dispatchEvent(new Event('keyup'));
    fixture.detectChanges();
    await fixture.whenStable();
    menuItems = fixture.elementRef.nativeElement.querySelectorAll('.menu-item');
    expect(menuItems.length).toEqual(3);
  });


});
