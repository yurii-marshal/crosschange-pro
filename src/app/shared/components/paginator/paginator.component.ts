import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { defaultPagination, Pagination } from 'src/app/shared/constants/pagination.constant';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() count = 0;
  @Input() limit = 20;
  @Input() visibleSetCount = 3;

  @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>();

  params = defaultPagination;

  currentPageSet: number[];

  currentPage = 0;

  private onDestroyed: Subject<void> = new Subject<void>();

  constructor(
    private gridService: GridService,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      takeUntil(this.onDestroyed)
    ).subscribe((params: Pagination) => {
      this.params = {
        offset: +params.offset || defaultPagination.offset,
        limit: +params.limit || defaultPagination.limit
      };
    });

    this.currentPage = +this.route.snapshot.queryParams.offset - 1 || 0;

    this.changePageSet(this.currentPage);

    this.setPage(this.currentPage);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.count.currentValue) {
      this.totalPages = new Array(Math.ceil(this.count / this.params.limit));
      if (this.totalPages.length > 1) {
        this.navigate();
      }
    }
  }

  setPage(page: number): void {
    this.currentPage = page;

    this.params = {
      offset: pageIndex * this.params.limit,
      limit: this.params.limit
    };

    this.onPageChanged(page);
  }

  onPageChanged(page: number): void {
    this.gridService.navigate(this.params);
    this.pageChanged.emit(page + 1);
  }

  nextPage(): void {
    if (this.currentPage < this.count - 1) {
      this.setPage(this.currentPage++);
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.setPage(this.currentPage--);
    }
  }

  getFirstPage(): void {
    this.changePageSet(0);
    this.onPageChanged(0);
  }

  getLastPage(): void {
    this.changePageSet(this.count - 1);
    this.onPageChanged(this.count - 1);
  }

  changePageSet(firstElement: number): void {
    firstElement = firstElement <= 0 ? 0 : firstElement >= this.count - 1 ? this.count - this.visibleSetCount : firstElement;
    this.currentPageSet = [...Array(this.visibleSetCount).keys()].map(() => firstElement++);
  }

  ngOnDestroy(): void {
    this.onDestroyed.next();
    this.onDestroyed.complete();
  }

}
