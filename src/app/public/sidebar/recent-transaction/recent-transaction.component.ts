import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recent-transaction',
  templateUrl: './recent-transaction.component.html',
  styleUrls: ['./recent-transaction.component.scss']
})

export class RecentTransactionComponent implements OnInit {
	@Input() transaction;
	@Input() theme;
	
	private hover: boolean = false;
	
	constructor() { }

  ngOnInit() {
  }

}
