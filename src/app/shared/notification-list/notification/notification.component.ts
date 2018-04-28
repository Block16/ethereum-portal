import { Component, HostBinding, Input, OnInit } from '@angular/core';
import {NotificationService} from '../../../core/notification.service';
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../../core/theme.service";
import {Theme} from "../../../shared/model/theme/theme";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  host: {
    '[style.background]': `theme.inverseMainStyle.background`,
    '[style.color]': `theme.inverseMainStyle.color`
  }
})
export class NotificationComponent implements OnInit {
	@Input() text: string;
	@Input() title: string;
	@Input() duration: number;
	@Input() index: number;
  private themeSubscription: Subscription;
  public theme: Theme;
	
  constructor(private notificationService: NotificationService,
					    private themeService: ThemeService) {
  	this.themeSubscription = this.themeService.theme.subscribe(theme => {
  	  this.theme = theme;
  	});
  }
  
  close() {
  	this.notificationService.close(this.index);
  }
  
  ngOnInit() {
  	console.log(this.duration);
  	if (this.duration != 0) {
  		setTimeout( ()=>{
  			this.close();
  		}, this.duration * 1000 * .9);
  	}
  }

}
