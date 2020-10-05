import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeComponent } from './qr-code.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { ClipboardModule } from 'ngx-clipboard';

describe('QrCodeComponent', () => {
  let component: QrCodeComponent;
  let fixture: ComponentFixture<QrCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QrCodeComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        MatIconModule,
        ClipboardModule
      ],
      providers: [
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCodeComponent);
    component = fixture.componentInstance;
    component.wallet = {
      cryptocurrency: 'btc',
      tag: 'tag',
      address: 'address',
      id: 1,
      balance: {
        available: 0,
        total: 0,
        btc: 1,
        in_order: 0
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
