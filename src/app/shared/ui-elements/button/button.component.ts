import {Component, Input, OnInit, Output, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../../core/theme.service";
import {Theme} from "../../model/theme/theme";

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  host: {
    tabindex: '0'
  }
})
export class ButtonComponent implements OnInit {
	
	@Input() kind: string;
  public theme: Theme;
  private themeSubscription: Subscription;
	
	constructor(private themeService: ThemeService) {
	  this.themeSubscription = this.themeService.theme.subscribe(theme => {
	    this.theme = theme;
	  });
	}
  
  spacebar() {
  	console.log('pressed space on focused element');
  }
  
  ngOnInit() {
  }

}
