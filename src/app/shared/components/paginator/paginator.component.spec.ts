import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorComponent } from './paginator.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { IconService } from '../../../core/services/icon.service';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { Component } from '@angular/core';
import { WalletService } from '../../../wallet/services/wallet.service';
import { WalletServiceMock } from '../../../../../testing/WalletServiceMock';
import { ActivatedRouteStub } from '../../../../../testing/ActivatedRouteStub';

@Component({
  selector: 'app-test-host',
  template: `
    <app-paginator
      [count]="pagesCount"
      [limit]="limit"
      [visiblePagesCount]="visiblePagesCount"
      (pageChanged)="onPageChange($event)"
    ></app-paginator>`
})
class TestHostComponent {
  public pagesCount: number;
  public limit: number;
  public visiblePagesCount: number;

  private onPageChange(page: number): void {
  }
}

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;
  let httpMock: HttpTestingController;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let routeStub: ActivatedRouteStub;
  const router = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    routeStub = new ActivatedRouteStub();
    TestBed.resetTestEnvironment();

    TestBed.configureTestingModule({
      declarations: [
        PaginatorComponent,
        NgModel,
      ],
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: ENVIRONMENT,
          useValue: environment as IEnvironment
        },
        IconService,
        {
          provide: WalletService,
          useClass: WalletServiceMock
        },
        {provide: MatIconRegistry, useClass: FakeMatIconRegistry},
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    hostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should get count of all table items', (done) => {
    component.ngOnInit();
    component.count = testHostComponent.pagesCount;
  });

  it('should change offset on button Next', (done) => {
    routeStub.setQueryParamMap({offset: 0, limit: 15});
    fixture.whenStable().then(() => {
      fixture.ngZone.run(() => {
        component.nextPage();
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalledWith([window.location.pathname], {queryParams: {offset: 15, limit: 15}});
        done();
      });
    });
  });

  it('should change offset on button Previous', (done) => {
    routeStub.setQueryParamMap({offset: 15, limit: 15});
    fixture.whenStable().then(() => {
      fixture.ngZone.run(() => {
        component.prevPage();
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalledWith([window.location.pathname], {queryParams: {offset: 0, limit: 15}});
        done();
      });
    });
  });

  it('should change offset on some page select', (done) => {
    routeStub.setQueryParamMap({offset: 15, limit: 15});
    fixture.whenStable().then(() => {
      fixture.ngZone.run(() => {
        const page: number = component.currentPage + 1;
        component.onPageChanged(page);
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalledWith([window.location.pathname], {queryParams: {offset: 30, limit: 15}});
        done();
      });
    });
  });

  it('should change offset on first page select if left ellipses are available', (done) => {
    routeStub.setQueryParamMap({offset: 120, limit: 15});
    fixture.whenStable().then(() => {
      fixture.ngZone.run(() => {
        component.totalPages = 6;
        component.getFirstPage();
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalledWith([window.location.pathname], {queryParams: {offset: 0, limit: 15}});
        done();
      });
    });
  });

  it('should change offset on last page select if right ellipses are available', (done) => {
    routeStub.setQueryParamMap({offset: 15, limit: 15});
    fixture.whenStable().then(() => {
      fixture.ngZone.run(() => {
        component.totalPages = 6;
        component.getLastPage();
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalledWith([window.location.pathname], {queryParams: {offset: 240, limit: 15}});
        done();
      });
    });
  });

  it('should change offset on left ellipses select', (done) => {
    routeStub.setQueryParamMap({offset: 60, limit: 15});
    fixture.whenStable().then(() => {
      fixture.ngZone.run(() => {
        component.totalPages = 6;
        component.visiblePagesCount = 3;
        component.switchVisiblePages(component.currentVisiblePages[0] - component.visiblePagesCount);
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalledWith([window.location.pathname], {queryParams: {offset: 15, limit: 15}});
        done();
      });
    });
  });

  it('should change offset on right ellipses select', (done) => {
    routeStub.setQueryParamMap({offset: 60, limit: 15});
    fixture.whenStable().then(() => {
      fixture.ngZone.run(() => {
        component.totalPages = 6;
        component.visiblePagesCount = 3;
        component.switchVisiblePages(component.currentVisiblePages[component.currentVisiblePages.length - 1] + 1);
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalledWith([window.location.pathname], {queryParams: {offset: 105, limit: 15}});
        done();
      });
    });
  });
});
