import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-order-history-container',
  templateUrl: './orders-history-container.component.html',
  styleUrls: ['./orders-history-container.component.scss']
})
export class OrdersHistoryContainerComponent implements OnInit {
  hideOtherPairs = new FormControl();

  constructor() { }

  ngOnInit(): void {
  }

}
