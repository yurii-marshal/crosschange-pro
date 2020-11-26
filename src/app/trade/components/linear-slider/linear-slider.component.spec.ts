import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearSliderComponent } from './linear-slider.component';

describe('LinearSliderComponent', () => {
  let component: LinearSliderComponent;
  let fixture: ComponentFixture<LinearSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinearSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinearSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
