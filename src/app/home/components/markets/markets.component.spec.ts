import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketsComponent } from './markets.component';
import { MarketsService } from '../../services/markets.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { WidgetComponent } from '../../../shared/components/widget/widget.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { environment } from '../../../../environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ActivatedRouteStub } from 'testing/ActivatedRouteStub';
import { MatTableModule } from '@angular/material/table';
import { PaginatorComponent } from 'src/app/shared/components/paginator/paginator.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatHeaderCellHarness } from '@angular/material/table/testing';

@Component({
  selector: 'app-test-host',
  template: '<input class="mat-table__search-input" [formControl]="searchInputControl" ngDefaultControl>'
})
class TestHostComponent {
  public searchInputControl: FormControl = new FormControl({value: null, disabled: false});
}

describe('MarketsComponent', () => {
  let component: MarketsComponent;
  let fixture: ComponentFixture<MarketsComponent>;
  let service: MarketsService;
  let routeStub: ActivatedRouteStub;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;
  let loader: HarnessLoader;

  beforeEach(async(() => {
    routeStub = new ActivatedRouteStub();

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MatTabsModule,
        NoopAnimationsModule,
        MatIconModule,
        MatTableModule,
        RouterTestingModule.withRoutes([
          {
            path: '',
            component: MarketsComponent
          },
          {
            path: '**',
            redirectTo: '',
            pathMatch: 'full'
          }
        ]),
        ReactiveFormsModule
      ],
      declarations: [
        MarketsComponent,
        WidgetComponent,
        PaginatorComponent,
        TestHostComponent,
      ],
      providers: [
        MarketsService,
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry },
        { provide: ENVIRONMENT, useValue: environment as IEnvironment },
        { provide: ActivatedRoute, useValue: routeStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach((done) => {
    routeStub.queryParams.subscribe(v => {
      fixture = TestBed.createComponent(MarketsComponent);
      component = fixture.componentInstance;

      hostFixture = TestBed.createComponent(TestHostComponent);
      testHostComponent = hostFixture.componentInstance;

      service = TestBed.inject(MarketsService);
      loader = TestbedHarnessEnvironment.loader(fixture);
      hostFixture.detectChanges();
      fixture.detectChanges();
      done();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default start settings', () => {
    const spy = spyOn(service, 'loadWidgetsData').and.callThrough();

    component.ngOnInit();

    expect(component.activeLink).toBe('favorite');
    expect(component.widgets).toBeDefined();

    expect(spy).toHaveBeenCalled();
  });

  it('should invoke load function when query params changed', async () => {
    const spy = spyOn(service, 'loadPairs').and.returnValue(of({count: 1, results: []}));
    routeStub.setQueryParamMap({ tab: 'btc', offset: '0', limit: '4' });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(spy).toHaveBeenCalledWith('', { tab: 'btc', offset: '0', limit: '4'});
    expect(component.count).toBe(1);
  });

  it('should change formControl value when input value changed', () => {
    testHostComponent.searchInputControl.valueChanges.subscribe(value => {
      expect(value).toEqual('mock value');
    });

    const input = hostFixture.nativeElement.querySelector('.mat-table__search-input');
    input.value = 'mock value';
    input.dispatchEvent(new Event('input'));
  });

  it('should invoke load function when input value changed', async () => {
    const spy = spyOn(service, 'loadPairs').and.returnValue(of({count: 3, results: []}));

    const input = fixture.nativeElement.querySelector('.mat-table__search-input');
    input.value = 'test';
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(spy).toHaveBeenCalledWith('test', {});
    expect(component.count).toBe(3);
  });

  it('should change current ordering if expected column was clicked', async () => {
    expect(component.currentOrdering).toBe('');
    const matHeaderCell = await loader.getHarness(MatHeaderCellHarness.with({text: 'markets_page.last'}));

    await matHeaderCell.host().then(vl => vl.click());
    expect(component.currentOrdering).toBe('last');

    await matHeaderCell.host().then(vl => vl.click());
    expect(component.currentOrdering).toBe('-last');

    await matHeaderCell.host().then(vl => vl.click());
    expect(component.currentOrdering).toBe(null);
  });

  it('should add/delete items to/from favorite', async () => {
    const mockElement = {
      is_favorite: true
    };
    const addSpy = spyOn(service, 'addToFavorite').and.returnValue(of([]));
    const deleteSpy = spyOn(service, 'deleteFromFavourite').and.returnValue(of([]));

    component.setFavourite(mockElement);
    expect(mockElement.is_favorite).toBe(false);
    expect(deleteSpy).toHaveBeenCalled();

    await component.setFavourite(mockElement);
    expect(mockElement.is_favorite).toBe(true);
    expect(addSpy).toHaveBeenCalled();
  });
});
