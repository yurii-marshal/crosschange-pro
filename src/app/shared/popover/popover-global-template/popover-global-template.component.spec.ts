import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverGlobalTemplateComponent } from './popover-global-template.component';

describe('PopoverComponent', () => {
  let component: PopoverGlobalTemplateComponent;
  let fixture: ComponentFixture<PopoverGlobalTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverGlobalTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverGlobalTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
