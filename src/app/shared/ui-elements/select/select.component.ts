import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../../core/theme.service";
import {Theme} from "../../model/theme/theme";
import {isNullOrUndefined} from "util";

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
  @Input() initialValue: any;

	public theme: Theme;
	private themeSubscription: Subscription;
	private focus: boolean = false;


	constructor(private themeService: ThemeService) {
	  this.themeSubscription = this.themeService.theme.subscribe(theme => {
	    this.theme = theme;
	  });
  }

  ngOnInit() {
    if (!isNullOrUndefined(this.initialValue)) {
      this.control.setValue(this.initialValue, {onlySelf: true});
    }
  }
}
