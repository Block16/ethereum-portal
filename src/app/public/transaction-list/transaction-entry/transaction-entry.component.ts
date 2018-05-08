import { Component, Input, OnInit } from '@angular/core';
import {TransactionInformation} from "../../../shared/model/transaction-information";

@Component({
  selector: 'app-transaction-entry',
  templateUrl: './transaction-entry.component.html',
  styleUrls: ['./transaction-entry.component.scss']
})
export class TransactionEntryComponent implements OnInit {

	@Input() transaction: TransactionInformation;
  @Input() theme;

  public monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

	public hover = false;

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    const win = window.open("https://etherscan.io/tx/0x" + this.transaction.hash, '_blank');
    win.focus();
  }

}
