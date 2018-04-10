import { Component, HostListener, OnInit } from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../../core/theme.service";
import {Theme} from "../../model/theme/theme";

@Component({
  selector: 'app-hover-style',
  templateUrl: './hover-style.component.html',
  styleUrls: ['./hover-style.component.scss'],
  host: {'[class.hover]': "this.hover",
         '[style.background]': `this.hover ? 'rgba('+
                this.theme.primaryColorRgb.r+','+
                this.theme.primaryColorRgb.g+','+
                this.theme.primaryColorRgb.b+','+
                this.theme.op1+')' :
                'transparent'`}
})
export class HoverStyleComponent implements OnInit {

	@HostListener('mouseover') onMouseOver() {
	   this.hover = true;
	}
	@HostListener('mouseleave') onMouseLeave() {
	   this.hover = false;
	}

	public theme: Theme;
	private themeSubscription: Subscription;
	private hover: boolean = false;
	
	constructor(private themeService: ThemeService) {
	  this.themeSubscription = this.themeService.theme.subscribe(theme => {
	    this.theme = theme;
	  });
  }

  ngOnInit() {
  }

}
