import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeComponent } from './qr-code.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { ClipboardCopyMockDirective } from '../../../../../testing/clipboard-copy-mock.directive';
import { MainTestHelper } from '../../../../../testing/MainTestHelper';

describe('QrCodeComponent', () => {
  let component: QrCodeComponent;
  let fixture: ComponentFixture<QrCodeComponent>;
  const initialMock = {
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
  const xrpMock = {
    cryptocurrency: 'xrp',
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
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QrCodeComponent,
        ClipboardCopyMockDirective
      ],
      imports: [
        TranslateModule.forRoot(),
        MatIconModule,
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
    component.wallet = initialMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display qr code', async () => {
    await fixture.whenStable();
    const addressImg = fixture.nativeElement.querySelector('.qr img');
    expect(addressImg.getAttribute('src')).toBeTruthy();
    const field = fixture.nativeElement.querySelector('.field');
    expect(field.innerText).toEqual(initialMock.address);
  });

  it('should display code and tag', async () => {
    component.wallet = xrpMock;
    fixture.detectChanges();
    await fixture.whenStable();
    const codes = fixture.nativeElement.querySelectorAll('.qr-container');
    expect(codes.length).toEqual(2);
    const addressImg = fixture.nativeElement.querySelector('.qr-container:nth-of-type(1) img');
    const tagImg = fixture.nativeElement.querySelector('.qr-container:nth-of-type(2) img');
    expect(addressImg.getAttribute('src')).toBeTruthy();
    expect(tagImg.getAttribute('src')).toBeTruthy();

    const addressField = fixture.nativeElement.querySelector('.qr-container:nth-of-type(1) .field');
    const tagField = fixture.nativeElement.querySelector('.qr-container:nth-of-type(2) .field');
    expect(addressField.innerText).toEqual(xrpMock.address);
    expect(tagField.innerText).toEqual(xrpMock.tag);
  });

  it('should copy address and tag to clipboard', async () => {
    component.wallet = xrpMock;
    fixture.detectChanges();
    await fixture.whenStable();
    const addressBtn = fixture.nativeElement.querySelector('.qr-container:nth-of-type(1) button');
    MainTestHelper.click(addressBtn);
    expect(addressBtn.getAttribute('clipboard-content')).toEqual(xrpMock.address);

    const tagBtn = fixture.nativeElement.querySelector('.qr-container:nth-of-type(2) button');
    MainTestHelper.click(tagBtn);
    expect(tagBtn.getAttribute('clipboard-content')).toEqual(xrpMock.tag);
  });

});
