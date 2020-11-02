import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
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
export class AddressSelectComponent implements OnChanges, ControlValueAccessor {
  @Input() addresses$: Observable<IAddress[]> = this.addressService.getRecipientAddresses();
  selected: IAddress;
  opened = false;

  @Output() countChanged: EventEmitter<number> = new EventEmitter();

  onChange = (address: IAddress) => {
  }
  onTouched = () => {
  }

  constructor(
    private addressService: AddressService,
  ) {
  }

  ngOnChanges(): void {
    this.addresses$ = this.addresses$
      .pipe(
        tap(v => {
          this.countChanged.emit(v.length);
          return !this.selected && this.writeValue(v[0]);
        }),
        shareReplay(),
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
