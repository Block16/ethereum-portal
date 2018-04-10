import {Attribute, Component, HostBinding, Input, OnInit, OnDestroy} from '@angular/core';
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

	@HostBinding('class.disabled') disabled = false;
  @HostBinding('class.accent') accent;
	@Input() kind: string;
  @Input('disabled') disabledInput = false;

  public theme: Theme;
  private themeSubscription: Subscription;

	constructor(
    @Attribute('size') private size: string = 'normal',
    @Attribute('accent') private accentAttribute: boolean = false,
    private themeService: ThemeService
    ) {
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
