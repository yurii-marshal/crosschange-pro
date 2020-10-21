import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinSelectComponent } from './coin-select.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { IconService } from '../../../core/services/icon.service';
import { CoinsService } from '../../services/coins.service';
import { CoinServiceMock, coinsMock } from '../../../../../testing/CoinServiceMock';
import { MainTestHelper } from '../../../../../testing/MainTestHelper';
import { Component, ViewChild } from '@angular/core';
import { DefaultValueAccessor, FormControl, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-test-host',
  template: '<app-qr-code [formControl]="ctrl" ngDefaultControl></app-qr-code>'
})
class TestHostComponent {
  @ViewChild(CoinSelectComponent)
  public coinSelect: CoinSelectComponent;
  public ctrl: FormControl = new FormControl({value: null, disabled: false});
}

describe('CoinSelectComponent', () => {
  let component: CoinSelectComponent;
  let fixture: ComponentFixture<CoinSelectComponent>;
  let httpMock: HttpTestingController;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CoinSelectComponent,
        TestHostComponent,
        DefaultValueAccessor,
        NgModel,
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
        IconService,
        {
          provide: CoinsService,
          useClass: CoinServiceMock
        },
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry },
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


    hostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should fetch coins', (done) => {
    component.ngOnInit();
    component.coins$.subscribe(res => {
      expect(res).toEqual(coinsMock);
      done();
    });
  });

  it('should set value', (done) => {
    component.ngOnInit();
    component.coins$.subscribe(res => {
      component.writeValue(res[0]);
      expect(component.selected).toEqual(res[0]);
      done();
    });
  });

  it('should selected value in variable', (done) => {
    component.ngOnInit();
    component.coins$.subscribe(res => {
      const switcher = fixture.elementRef.nativeElement.querySelector('.switcher');
      expect(component.opened).toEqual(false);
      MainTestHelper.click(switcher);
      fixture.detectChanges();
      expect(component.opened).toEqual(true);
      const menu: HTMLElement = fixture.elementRef.nativeElement.querySelector('.coins-menu');
      expect(menu.classList.contains('visible')).toEqual(true);
      const menuItems = fixture.elementRef.nativeElement.querySelectorAll('.menu-item');
      MainTestHelper.click(menuItems[1]);
      expect(component.selected).toEqual(res[1]);
      done();
    });
  });

  it('should have Ripple selected in template', async () => {
    const switcher = fixture.elementRef.nativeElement.querySelector('.switcher');
    MainTestHelper.click(switcher);
    fixture.detectChanges();
    const menuItems = fixture.elementRef.nativeElement.querySelectorAll('.menu-item');
    const rippleIdx = coinsMock.findIndex((v) => v.key === 'xrp');
    MainTestHelper.click(menuItems[rippleIdx]);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.selected.key).toEqual('xrp');
    expect(switcher.innerText).toEqual('Ripple/XRP');
  });


  it('should get/set value as a form control',  (done) => {
    testHostComponent.ctrl.valueChanges.pipe(take(1)).subscribe(v => {
      expect(v).toEqual(coinsMock[rippleIdx]);
      done();
    });
    const rippleIdx = coinsMock.findIndex((v) => v.key === 'xrp');
    testHostComponent.ctrl.setValue(coinsMock[rippleIdx]);
    hostFixture.detectChanges();
  });

});
