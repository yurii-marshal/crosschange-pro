import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface Pagination {
  offset: number;
  limit: number;
}

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  count = 0;

  params: Pagination = {
    offset: 0,
    limit: 2
  };

  totalPages: number[] = [];

  private onDestroyed: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      takeUntil(this.onDestroyed)
    ).subscribe((params: Pagination) => {
      this.params = {
        offset: +params.offset || 0,
        limit: +params.limit || 2
      };
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.count.currentValue) {
      this.totalPages = new Array(Math.ceil(this.count / this.params.limit));
      if (this.totalPages.length > 1) {
        this.navigate();
      }
    }
  }

  pageChanged(pageIndex: number): void {
    this.params = {
      offset: pageIndex * this.params.limit,
      limit: this.params.limit
    };
    this.navigate();
  }

  nextPage(): void {
    if (this.params.offset + this.params.limit < this.count) {
      this.params.offset += this.params.limit;
      this.navigate();
    }
  }

  prevPage(): void {
    if (this.params.offset > 0) {
      this.params.offset -= this.params.limit;
      this.navigate();
    }
  }

  navigate(): void {
    this.router.navigate([window.location.pathname], {
      queryParams: {
        ...this.route.snapshot.queryParams,
        ...this.params
      }
    });
  }

  isActive(pageIndex: number): boolean {
    return Math.floor(this.params.offset / this.params.limit) === pageIndex;
  }

  ngOnDestroy(): void {
    this.onDestroyed.next();
    this.onDestroyed.complete();
  }

}
