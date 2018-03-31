import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { DataShareService } from "../../../core/data-share.service";

@Component({
  selector: 'transaction-dot',
  templateUrl: './transaction-dot.component.html',
  styleUrls: ['./transaction-dot.component.scss']
})
export class TransactionDotComponent implements OnInit {
  @Input() status = 'processing';

	constructor(private dataShareService: DataShareService) {
	  this.dataShareService.userPreferences.subscribe((value: any) => {
	    this.theme = this.dataShareService.getTheme(value['theme']);
	  });
	}

  ngOnInit() {
  }

}
