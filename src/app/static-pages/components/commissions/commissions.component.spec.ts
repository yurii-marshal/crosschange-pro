import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionsComponent } from './commissions.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry, MatIconTestingModule } from '@angular/material/icon/testing';

describe('CommissionsComponent', () => {
  let component: CommissionsComponent;
  let fixture: ComponentFixture<CommissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        MatTableModule,
        MatIconModule,
        MatIconTestingModule,
      ],
      providers: [
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry },
      ],
      declarations: [ CommissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
