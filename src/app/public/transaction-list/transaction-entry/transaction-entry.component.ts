import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-transaction-entry',
  templateUrl: './transaction-entry.component.html',
  styleUrls: ['./transaction-entry.component.scss']
})
export class TransactionEntryComponent implements OnInit {
	
	@Input() transaction;
  @Input() theme;
	
	private hover: boolean = false;
	
  constructor() { }

  ngOnInit() {
  }

}
