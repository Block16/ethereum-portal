import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineButtonComponent } from './inline-button.component';

describe('InlineButtonComponent', () => {
  let component: InlineButtonComponent;
  let fixture: ComponentFixture<InlineButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
