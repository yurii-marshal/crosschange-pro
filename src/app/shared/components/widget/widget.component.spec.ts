import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetComponent } from './widget.component';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IExchangeData } from '../../interfaces/exchange-data.interface';
import { NgxEchartsModule } from 'ngx-echarts';

describe('WidgetComponent', () => {
  let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        TranslateModule.forRoot(),
        NgxEchartsModule.forRoot({
          /**
           * This will import all modules from echarts.
           * If you only need custom modules,
           * please refer to [Custom Build] section.
           */
          echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
        }),
      ],
      declarations: [ WidgetComponent ],
      providers: [
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    const rateMock: IExchangeData = {
      is_favorite: false,
      exchange_type: '1',
      last: '1.5',
      exchange_rate: '1.5',
      change_percent_24: '50',
      high_24: '1',
      low_24: '1',
      market_cap: '1',
      vol_24: '1',
      pair: '1',
      cng: '1',
      high: '1',
      low: '1',
      vol: '1',
      mktCap: '1',
      prices: [],
    };
    fixture = TestBed.createComponent(WidgetComponent);
    fixture.componentInstance.widgetInfo = rateMock;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
