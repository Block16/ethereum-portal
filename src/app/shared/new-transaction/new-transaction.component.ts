import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss']
})
export class NewTransactionComponent implements OnInit {
	
	@Input('mode') mode;
	@Input('transaction') transaction;
	@Input('newTxStyle') newTxStyle;
	@Input('newTxCircleStyle') newTxCircleStyle;
	@Input('small') small;
	@Input('currentAuth') currentAuth;
	
  constructor() { }

  ngOnInit() {
  	
  }

}
