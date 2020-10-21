import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
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
  @Input() count = 0;
  @Input() limit = defaultPagination.limit;

  params = defaultPagination;

  pages = [];
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
    if (changes.count.currentValue) {
      this.onDetectCountChanges(changes.count.currentValue);
    }
  }

  onDetectCountChanges(count): void {
    this.count = count;
    this.currentPage = Math.ceil(this.params.offset / this.params.limit) || 0;
    this.pages = [...Array(Math.ceil(count / this.params.limit)).keys()];

    if (this.currentPage > this.pages.length - 1) {
      this.currentPage = 0;
    }

    this.setPage(this.currentPage);
  }

  setPage(page: number): void {
    this.currentPage = page;

    this.params = {
      offset: page * this.params.limit,
      limit: this.params.limit,
    };

    this.gridService.navigate(this.params);
  }

  nextPage(): void {
    if (this.currentPage < this.pages.length - 1) {
      this.setPage(++this.currentPage);
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.setPage(--this.currentPage);
    }
  }

  ngOnDestroy(): void {
    this.onDestroyed.next();
    this.onDestroyed.complete();
  }

}
