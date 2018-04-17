import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../core/notification.service';
import { Subscription } from "rxjs/Subscription";
import {ThemeService} from "../../core/theme.service";
import {Theme} from "../../shared/model/theme/theme";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
	
	private notificationSubscription: Subscription;
	private notifications = [];
  private themeSubscription: Subscription;
  public theme: Theme;
	
  constructor(private notificationService: NotificationService,
						  private themeService: ThemeService,) {
  	
    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
    });
    
  	this.notificationSubscription = this.notificationService.notifications.subscribe(notifications => {
  	  this.notifications = notifications;
  	});
  }

  ngOnInit() {
  	this.notificationService.message('Message with NO title supplied');
  	this.notificationService.message('Message with title supplied', 'Title');
  	this.notificationService.error('Error with NO title supplied');
  	this.notificationService.error('Error with title supplied', 'Title');
  }

}
