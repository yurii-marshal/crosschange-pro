import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketsComponent } from './markets.component';
import { MarketsService } from '../../services/markets.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { WidgetComponent } from '../../../shared/components/widget/widget.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';

describe('MarketsComponent', () => {
  let component: MarketsComponent;
  let fixture: ComponentFixture<MarketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MatTabsModule,
        NoopAnimationsModule,
        MatIconModule
      ],
      declarations: [
        MarketsComponent,
        WidgetComponent
      ],
      providers: [
        MarketsService,
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
