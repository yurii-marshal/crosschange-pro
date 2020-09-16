import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseComponent } from './base.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { IconService } from '../../../core/services/icon.service';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { routes } from '../../../app-routing.module';
import { routes as homeRoutes } from '../../../home/home.module';
import { Route, Router } from '@angular/router';
import { SharedModule } from '../../shared.module';

describe('BaseComponent', () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        SharedModule,
        RouterTestingModule.withRoutes(routes),
        TranslateModule.forRoot(),
        MatIconModule,
        MatMenuModule
      ],
      providers: [
        IconService,
        MatIconRegistry,
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have headerClass prop', async () => {
    /**
     * not just await router.navigate(['']) because in that case will get warning:
     * "Navigation triggered outside Angular zone"
     */
    await new Promise((resolve, reject) => {
      fixture.ngZone.run(() => {
        router.navigate(['']).then(() => {
          resolve();
        });
      });
    });

    const route = homeRoutes.filter((v: Route) => v.path === '').shift();
    if (route && route.data.headerClass) {
      expect(component.headerClass).toEqual(route.data.headerClass);
    }
  });
});
