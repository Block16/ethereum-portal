import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../../core/theme.service";
import {Theme} from "../../model/theme/theme";

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit  {
  @Input() control: FormControl;
  @Input() options: Theme[];
  @Input() optionProperty: string;
  @Input() placeholder: string;
	
	public theme: Theme;
	private themeSubscription: Subscription;
	private focus: boolean = false;
	
	constructor(private themeService: ThemeService) {
	  this.themeSubscription = this.themeService.theme.subscribe(theme => {
	    this.theme = theme;
	  });
	}
	
	

  ngOnInit() {
  }

}
