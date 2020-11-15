import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizableWindowComponent } from './resizable-window.component';

describe('ResizableWindowComponent', () => {
  let component: ResizableWindowComponent;
  let fixture: ComponentFixture<ResizableWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResizableWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizableWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
