import { ChangeDetectionStrategy, Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { IAddress } from '../../interfaces/address.interface';
import { AddressService } from '../../services/address.service';

@Component({
  selector: 'app-address-select',
  templateUrl: './address-select.component.html',
  styleUrls: ['./address-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressSelectComponent),
      multi: true
    }
  ]
})
export class AddressSelectComponent implements OnInit, ControlValueAccessor {
  opened = false;
  addresses$: Observable<IAddress[]>;
  selected: IAddress;
  onChange = (address: IAddress) => {};
  onTouched = () => {};
  constructor(
    private addressService: AddressService,
  ) { }

  ngOnInit(): void {
    this.addresses$ = this.addressService.getRecipientAddresses()
      .pipe(
        take(1),
        tap(v  => !this.selected && this.writeValue(v[0]))
      );
  }

  registerOnChange(fn: (address: IAddress) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(address: IAddress): void {
    if (!address) {
      return;
    }
    this.selected = address;
    this.onChange(address);
  }

}
