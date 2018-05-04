import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recent-transaction',
  templateUrl: './recent-transaction.component.html',
  styleUrls: ['./recent-transaction.component.scss']
})

export class RecentTransactionComponent implements OnInit {
	@Input() transaction;
	@Input() theme;

	public hover = false;

	constructor() { }

  ngOnInit() {
  }

}
