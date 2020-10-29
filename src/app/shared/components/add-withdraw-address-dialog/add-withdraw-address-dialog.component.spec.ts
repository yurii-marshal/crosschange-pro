import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWithdrawAddressDialogComponent } from './add-withdraw-address-dialog.component';

describe('AddWithdrawAddressDialogComponent', () => {
  let component: AddWithdrawAddressDialogComponent;
  let fixture: ComponentFixture<AddWithdrawAddressDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWithdrawAddressDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWithdrawAddressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
