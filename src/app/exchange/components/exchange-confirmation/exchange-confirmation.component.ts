import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExchangeService, IExchangeRequest } from '../../../shared/services/exchange.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-exchange-confirmation',
  templateUrl: './exchange-confirmation.component.html',
  styleUrls: ['./exchange-confirmation.component.scss']
})
export class ExchangeConfirmationComponent {
  confirmationStage: number;

  constructor(
    public dialogRef: MatDialogRef<ExchangeConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private exchangeService: ExchangeService
  ) {
    this.confirmationStage = this.data.confirmationStage;
  }

  confirmExchange(): void {
    this.confirmationStage = 2;
    const req: IExchangeRequest = {
      from: this.data.fromCurrencyKey,
      to: this.data.toCurrencyKey,
      amount: this.data.fromCurrencyAmount,
      rate: this.data.rate,
      fee: this.data.fee
    };
    this.exchangeService.exchange(req)
      .pipe(take(1))
      .subscribe(_ => {
        this.confirmationStage = 3;
        this.closeDialog(true);
      }, err => this.closeDialog(false));
  }

  closeDialog(result?): void {
    this.dialogRef.close(result);
  }
}
