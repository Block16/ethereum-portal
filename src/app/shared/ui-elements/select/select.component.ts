import { Attribute, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../../core/theme.service";
import {Theme} from "../../model/theme/theme";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  host: {'[class.small]': "this.small", 
				 '[class.hover]': "this.hover",
         '[style.background]': `this.hover ? 'rgba('+
                this.theme.primaryColorRgb.r+','+
                this.theme.primaryColorRgb.g+','+
                this.theme.primaryColorRgb.b+','+
                this.theme.op3+')' :
                'rgba('+
                this.theme.primaryColorRgb.r+','+
                this.theme.primaryColorRgb.g+','+
                this.theme.primaryColorRgb.b+','+
                this.theme.op2+')'`}
})
export class SelectComponent implements OnInit  {
  @Input() control: FormControl;
  @Input() options: Theme[];
  @Input() optionProperty: string;
  @Input() placeholder: string;
  @Input() initialValue: any;
  @HostListener('mouseover') onMouseOver() {
     this.hover = true;
  }
  @HostListener('mouseleave') onMouseLeave() {
     this.hover = false;
  }

  private hover: boolean = false;
	public theme: Theme;
	private themeSubscription: Subscription;
	private focus: boolean = false;


	constructor(@Attribute('small') private small: boolean|null,
							private themeService: ThemeService) {
		this.small = (small != null);
		
	  this.themeSubscription = this.themeService.theme.subscribe(theme => {
	    this.theme = theme;
	  });
  }
  
  increment() {
  	this.test++;
  }
  
  ngOnInit() {
    if (!isNullOrUndefined(this.initialValue)) {
      this.control.setValue(this.initialValue, {onlySelf: true});
    }
  }
}
