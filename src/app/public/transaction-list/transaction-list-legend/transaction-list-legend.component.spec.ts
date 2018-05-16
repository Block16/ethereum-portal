import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionListLegendComponent } from './transaction-list-legend.component';

describe('TransactionListLegendComponent', () => {
  let component: TransactionListLegendComponent;
  let fixture: ComponentFixture<TransactionListLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionListLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionListLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
