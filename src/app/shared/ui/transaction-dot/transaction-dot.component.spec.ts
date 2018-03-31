import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDotComponent } from './transaction-dot.component';

describe('TransactionDotComponent', () => {
  let component: TransactionDotComponent;
  let fixture: ComponentFixture<TransactionDotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionDotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
