import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { IWalletAddress } from '../../interfaces/address.interface';
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
  addresses$: Observable<IWalletAddress[]>;
  selected: IWalletAddress;

  @Input() addresses: IWalletAddress[];
  @Output() countChanged: EventEmitter<number> = new EventEmitter();

  onChange = (address: IWalletAddress) => {
  }
  onTouched = () => {
  }

  constructor(
    private addressService: AddressService,
  ) {
  }

  ngOnInit(): void {
    if (!this.addresses) {
      this.addresses$ = this.addressService.getRecipientAddresses()
        .pipe(
          take(1),
          tap(v => {
            this.countChanged.emit(v.length);
            return !this.selected && this.writeValue(v[0]);
          })
        );
    } else {
      this.addresses$ = of(this.addresses);

      if (!this.selected) {
        this.writeValue(this.addresses[0]);
      }
    }
  }

  registerOnChange(fn: (address: IWalletAddress) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(address: IWalletAddress): void {
    if (!address) {
      return;
    }
    this.selected = address;
    this.onChange(address);
  }

}
