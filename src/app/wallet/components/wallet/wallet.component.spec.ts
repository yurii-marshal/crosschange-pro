import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletComponent } from './wallet.component';
import { ActivatedRouteStub } from 'testing/ActivatedRouteStub';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import {
  ENVIRONMENT,
  IEnvironment
} from 'shared-kuailian-lib';
import { TranslateModule } from '@ngx-translate/core';
import { ToggleSecretTextPipe } from 'src/app/shared/pipes/toggle-secret-text.pipe';
import { WalletService } from 'src/app/wallet/services/wallet.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Component } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { PaginatorComponent } from 'src/app/shared/components/paginator/paginator.component';
import { cryptoList, walletBalanceMock, walletListMock, WalletServiceMock } from 'testing/WalletServiceMock';
import { UserServiceMock } from 'testing/UserServiceMock';
import { of } from 'rxjs';

@Component({
  selector: 'app-test-host',
  template: `<input class="mat-table__search-input" [formControl]="searchInputControl" ngDefaultControl>`
})
class TestHostComponent {
  public searchInputControl: FormControl = new FormControl({value: null, disabled: false});
}

describe('WalletComponent', () => {
  let component: WalletComponent;
  let fixture: ComponentFixture<WalletComponent>;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;
  let routeStub: ActivatedRouteStub;
  let walletService: WalletService;
  let userService: UserService;

  beforeEach(async(() => {
    routeStub = new ActivatedRouteStub();

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        MatTableModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: '',
            component: WalletComponent
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
        WalletComponent,
        ToggleSecretTextPipe,
        PaginatorComponent,
        TestHostComponent
      ],
      providers: [
        {provide: WalletService, useClass: WalletServiceMock},
        {provide: UserService, useClass: UserServiceMock},
        {provide: MatIconRegistry, useClass: FakeMatIconRegistry},
        {provide: ENVIRONMENT, useValue: environment as IEnvironment},
        {provide: ActivatedRoute, useValue: routeStub},
      ]
    })
      .compileComponents();
  }));

  beforeEach((done) => {
    routeStub.queryParams.subscribe(v => {
      fixture = TestBed.createComponent(WalletComponent);
      component = fixture.componentInstance;

      hostFixture = TestBed.createComponent(TestHostComponent);
      testHostComponent = hostFixture.componentInstance;

      walletService = TestBed.inject(WalletService);
      userService = TestBed.inject(UserService);

      hostFixture.detectChanges();
      fixture.detectChanges();
      done();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change formControl value when input value changed', () => {
    testHostComponent.searchInputControl.valueChanges.subscribe(value => {
      expect(value).toEqual('mock value');
    });

    const input = hostFixture.nativeElement.querySelector('.mat-table__search-input');
    input.value = 'mock value';
    input.dispatchEvent(new Event('input'));
  });

  it('should set component variables according to service data', async () => {
    await fixture.whenStable();

    expect(component.cryptoPairs).toEqual(cryptoList);
    component.walletBalance$.subscribe(v => expect(v).toEqual(walletBalanceMock));
    expect(component.cryptoBalanceCount).toBe(walletListMock.count);
  });

  it('should set cryptoPairs according service value', async () => {
    const spy = spyOn(walletService, 'getCryptoPairs').and.returnValue(of(['first', 'second']));
    component.ngOnInit();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(spy).toHaveBeenCalled();
    expect(component.cryptoPairs).toEqual(['first', 'second']);
  });

  it('should change hideLowBalance value if toggleLowBalance invoked', async () => {
    const hideBalanceButton = fixture.nativeElement.querySelector('.hide-balance-btn');
    expect(component.hideLowBalance$.getValue()).toEqual(false);

    component.toggleLowBalance();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.hideLowBalance$.getValue()).toEqual(true);

    hideBalanceButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.hideLowBalance$.getValue()).toEqual(false);
  });

  it('should change hideNumbers value if toggleNumVisibility invoked', async () => {
    localStorage.clear();
    const hideNumbersButton = fixture.nativeElement.querySelector('.total-balance__amount-hide-btn');
    expect(component.hideNumbers$.getValue()).toEqual(false);

    component.toggleNumVisibility();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.hideNumbers$.getValue()).toEqual(true);

    hideNumbersButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.hideNumbers$.getValue()).toEqual(false);
  });
});
