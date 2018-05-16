import { Component, Input, OnInit } from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../../core/theme.service";
import {Theme} from "../../model/theme/theme";

@Component({
  selector: 'app-arrow',
  templateUrl: './arrow.component.html',
  styleUrls: ['./arrow.component.scss'],
  host: {
  	'[class.from]': `this.direction == 'from'`,
  	'[class.to]': `this.direction == 'to'`
  }
})
export class ArrowComponent implements OnInit {
	
	@Input() direction: string;
	
  public theme: Theme;
  private themeSubscription: Subscription;
	
  constructor(private themeService: ThemeService) {
  	this.themeSubscription = this.themeService.theme.subscribe(theme => {
  	  this.theme = theme;
  	});
  }

  ngOnInit() {
  }

}
