import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorComponent } from './paginator.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { IconService } from '../../../core/services/icon.service';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { WalletService } from '../../../wallet/services/wallet.service';
import { WalletServiceMock } from '../../../../../testing/WalletServiceMock';
import { ActivatedRouteStub } from '../../../../../testing/ActivatedRouteStub';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SimpleChange } from '@angular/core';

fdescribe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;
  let httpMock: HttpTestingController;

  let routeStub: ActivatedRouteStub;

  const router = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(async(() => {
    routeStub = new ActivatedRouteStub();
    TestBed.resetTestEnvironment();

    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
      .configureTestingModule({
        declarations: [
          PaginatorComponent,
        ],
        imports: [
          HttpClientTestingModule,
          MatIconModule,
          RouterTestingModule.withRoutes([
            {
              path: '',
              component: PaginatorComponent
            },
            {
              path: '**',
              redirectTo: '',
              pathMatch: 'full'
            }
          ]),
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
          {provide: ActivatedRoute, useValue: routeStub},
          {provide: Router, useValue: router},
        ]
      });

    httpMock = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    component.count = 100;
    component.visiblePagesCount = 3;

    component.ngOnChanges({
      count: new SimpleChange(null, component.count, true)
    });

    fixture.detectChanges();
  });

  it('should create component PaginatorComponent', () => {
    expect(component).toBeTruthy();
  });


  fit('should set currentPage accordingly to params values on component init', () => {
    routeStub.setQueryParamMap({offset: 30, limit: 10});

    fixture.detectChanges();

    expect(component.currentPage).toEqual(3);
  });

  it('should change offset on button Next', () => {
    component.currentPage = 0;
    component.params.offset = 0;
    component.nextPage();

    expect(component.currentPage).toBe(1);
    expect(component.params.offset).toBe(15);
  });

  it('should change offset on button Previous', () => {
    component.currentPage = 1;
    component.params.offset = 15;
    component.prevPage();

    expect(component.currentPage).toBe(0);
    expect(component.params.offset).toBe(0);
  });

  it('should change offset on some page select', () => {
    component.currentPage = 0;
    component.params.offset = 0;
    component.setPage(5);

    expect(component.currentPage).toBe(5);
    expect(component.params.offset).toBe(75);
  });

  it('should change offset on first page select if left ellipses are available', () => {
    component.currentPage = 5;
    component.params.offset = 75;
    component.getFirstPage();

    expect(component.currentPage).toBe(0);
    expect(component.params.offset).toBe(0);
  });

  it('should change offset on last page select if right ellipses are available', () => {
    component.currentPage = 5;
    component.params.offset = 75;
    component.getLastPage();

    expect(component.currentPage).toBe(6);
    expect(component.params.offset).toBe(90);
  });

  it('should change offset on left ellipses select', () => {
    component.currentPage = 5;
    component.params.offset = 75;
    component.switchVisiblePages(2);

    expect(component.currentPage).toBe(0);
    expect(component.params.offset).toBe(0);
  });

  it('should change offset on right ellipses select', () => {
    component.currentPage = 1;
    component.params.offset = 15;
    component.switchVisiblePages(6);

    expect(component.currentPage).toBe(6);
    expect(component.params.offset).toBe(90);
  });

  it('function getVisiblePages should evaluate a set of visible pages', () => {
    component.currentVisiblePages = [0, 1, 2];
    component.getVisiblePages(5);

    expect(component.currentVisiblePages).toEqual([3, 4, 5]);
  });
});
