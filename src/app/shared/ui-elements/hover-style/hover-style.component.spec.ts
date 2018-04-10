import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverStyleComponent } from './hover-style.component';

describe('HoverStyleComponent', () => {
  let component: HoverStyleComponent;
  let fixture: ComponentFixture<HoverStyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoverStyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoverStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
