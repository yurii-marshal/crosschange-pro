import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeComponent implements OnInit {

  leftContainer: string[] = [];
  centralContainer: string[] = [];
  rightContainer: string[] = [];

  isTradeTypeSelectorOpened: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  toggleTradeSelector(): void {
    this.isTradeTypeSelectorOpened = !this.isTradeTypeSelectorOpened;
  }

  playSpotTutorial(): void {
  }

}
