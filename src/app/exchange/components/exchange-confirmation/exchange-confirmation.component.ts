import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-exchange-confirmation',
  templateUrl: './exchange-confirmation.component.html',
  styleUrls: ['./exchange-confirmation.component.scss']
})
export class ExchangeConfirmationComponent {
  confirmationStage: number;

  constructor(
    public dialogRef: MatDialogRef<ExchangeConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.confirmationStage = this.data.confirmationStage;
  }

  confirmExchange(): void {
    this.confirmationStage = 2;
    setTimeout(() => this.confirmationStage = 3, 3000);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
