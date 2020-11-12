import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PopoverFlexibleTemplateComponent } from './popover-flexible-template.component';
import { TranslateModule } from '@ngx-translate/core';
import { defaultPopoverConfig, POPOVER_CONFIG_TOKEN } from '../popover-config';


describe('PopoverComponent', () => {
  let component: PopoverFlexibleTemplateComponent;
  let fixture: ComponentFixture<PopoverFlexibleTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [ PopoverFlexibleTemplateComponent ],
      providers: [
        {
          provide: POPOVER_CONFIG_TOKEN,
          useValue: defaultPopoverConfig
        }
      ]
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
