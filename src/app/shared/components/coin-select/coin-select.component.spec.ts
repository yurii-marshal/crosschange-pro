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

describe('CoinSelectComponent', () => {
  let component: CoinSelectComponent;
  let fixture: ComponentFixture<CoinSelectComponent>;
  let httpMock: HttpTestingController;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinSelectComponent ],
      imports: [
        HttpClientTestingModule,
        MatIconModule
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
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it('should select value', (done) => {
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

});
