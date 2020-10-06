import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PopoverFlexibleTemplateComponent } from './popover-flexible-template.component';


describe('PopoverComponent', () => {
  let component: PopoverFlexibleTemplateComponent;
  let fixture: ComponentFixture<PopoverFlexibleTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverFlexibleTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverFlexibleTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
