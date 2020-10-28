import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { delay, shareReplay, tap } from 'rxjs/operators';
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
export class AddressSelectComponent implements OnInit, AfterViewChecked, ControlValueAccessor {
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
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.addresses$ = this.addresses$
      .pipe(
        delay(0),
        tap(v => {
          this.countChanged.emit(v.length);
          return !this.selected && this.writeValue(v[0]);
        }),
        shareReplay(),
      );
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
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
