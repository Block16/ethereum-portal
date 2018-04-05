import { Component, Input, OnInit } from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../../core/theme.service";
import {Theme} from "../../model/theme/theme";

@Component({
  selector: 'app-toggle-section',
  templateUrl: './toggle-section.component.html',
  styleUrls: ['./toggle-section.component.scss']
})
export class ToggleSectionComponent implements OnInit {
	
	@Input() title: string;
	private show: boolean = false;
	
  private theme: Theme;
  private themeSubscription: Subscription;
  

	constructor(private themeService: ThemeService) {
	  this.themeSubscription = this.themeService.theme.subscribe(theme => {
	    this.theme = theme;
	  });
	}

  ngOnInit() {
  }

}
