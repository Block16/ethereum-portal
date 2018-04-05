import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleSectionComponent } from './toggle-section.component';

describe('ToggleSectionComponent', () => {
  let component: ToggleSectionComponent;
  let fixture: ComponentFixture<ToggleSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToggleSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
