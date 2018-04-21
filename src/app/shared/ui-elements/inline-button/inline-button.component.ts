import { Attribute, Component, Input, OnInit } from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../../core/theme.service";
import {Theme} from "../../model/theme/theme";

@Component({
  selector: 'app-inline-button',
  templateUrl: './inline-button.component.html',
  styleUrls: ['./inline-button.component.scss']
})
export class InlineButtonComponent implements OnInit {
	
	public theme: Theme;
	private themeSubscription: Subscription;
	
  constructor(@Attribute('href') private href: string,
  						private themeService: ThemeService) {
  	this.themeSubscription = this.themeService.theme.subscribe(theme => {
  	  this.theme = theme;
      this.themeService.updateSVGs(theme);
  	});
  }

  ngOnInit() {
  }

}
