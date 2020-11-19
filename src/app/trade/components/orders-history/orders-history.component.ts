import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-order-history',
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss']
})
export class OrdersHistoryComponent implements OnInit {
  hideOtherPairs = new FormControl();

  constructor() { }

  ngOnInit(): void {
  }

}
