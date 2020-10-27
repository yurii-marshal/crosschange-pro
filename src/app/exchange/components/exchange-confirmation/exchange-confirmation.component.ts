import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExchangeService } from '../../../shared/services/exchange.service';

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
    this.exchangeService.exchange(
      this.data.fromCurrencyKey,
      this.data.toCurrencyKey,
      this.data.fromCurrencyAmount,
      this.data.rate,
      this.data.fee
    ).subscribe(_ => {
      this.confirmationStage = 3;
    });
  }

  closeDialog(result?): void {
    this.dialogRef.close(result);
  }
}
