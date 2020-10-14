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
import { GridService } from '../../services/grid.service';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() count;
  @Input() limit = defaultPagination.limit;
  @Input() visiblePagesCount = 3;

  @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>();

  params = defaultPagination;

  currentVisiblePages: number[] = [];

  totalPages = 1;
  currentPage = 0;

  private onDestroyed: Subject<void> = new Subject<void>();

  constructor(
    private gridService: GridService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      takeUntil(this.onDestroyed)
    ).subscribe((params: Pagination) => {
      this.params = {
        offset: +params.offset || defaultPagination.offset,
        limit: +params.limit || this.limit,
      };

      this.onDetectCountChanges(this.count);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.count.currentValue && changes.count.currentValue !== this.count) {
      this.onDetectCountChanges(changes.count.currentValue);
    }
  }

  onDetectCountChanges(count: number): void {
    this.count = count;
    this.currentPage = Math.ceil(this.params.offset / this.params.limit) || 0;
    this.totalPages = Math.ceil(count / this.params.limit);

    if (this.currentPage > this.totalPages - 1) {
      this.currentPage = 0;
    }

    this.getVisiblePages(this.currentPage);

    this.setPage(this.currentPage);
  }

  setPage(page: number): void {
    this.currentPage = page;

    this.params = {
      offset: page * this.params.limit,
      limit: this.params.limit,
    };

    this.onPageChanged(page);
  }

  onPageChanged(page: number): void {
    this.gridService.navigate(this.params);
    this.pageChanged.emit(page + 1);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.setPage(++this.currentPage);

      if (this.currentPage > this.currentVisiblePages[this.currentVisiblePages.length - 1]) {
        this.getVisiblePages(this.currentPage);
      }
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.setPage(--this.currentPage);

      if (this.currentPage < this.currentVisiblePages[0]) {
        this.getVisiblePages((this.currentPage + 1) - this.visiblePagesCount);
      }
    }
  }

  switchVisiblePages(firstElement): void {
    this.getVisiblePages(firstElement);
    this.setPage(this.currentVisiblePages[0]);
  }

  getFirstPage(): void {
    this.setPage(0);
    this.getVisiblePages(0);
  }

  getLastPage(): void {
    this.setPage(this.totalPages - 1);
    this.getVisiblePages(this.totalPages - 1);
  }

  getVisiblePages(currentElement: number): void {
    this.currentVisiblePages = [...Array(Math.ceil(this.totalPages / this.visiblePagesCount)).keys()]
      .map((set: number) => {
        const pagesInSet = [...Array(this.visiblePagesCount).keys()];

        return pagesInSet.map((order: number) => {
          const page = set * this.visiblePagesCount + order;

          if (page <= this.totalPages - 1) {
            return page;
          }
        }).filter((order: number) => !isNaN(order));
      })
      .filter((set: number[]) => set.includes(currentElement))
      .reduce((accumulator: number[], value: number[]) => accumulator.concat(value), []);
  }

  ngOnDestroy(): void {
    this.onDestroyed.next();
    this.onDestroyed.complete();
  }

}
