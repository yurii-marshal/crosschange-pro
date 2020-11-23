import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundsComponent } from './founds.component';

describe('FoundsComponent', () => {
  let component: FoundsComponent;
  let fixture: ComponentFixture<FoundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
