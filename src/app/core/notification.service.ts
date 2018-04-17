import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Notification } from '../shared/model/notification';

@Injectable()
export class NotificationService {
	
	public notifications = new BehaviorSubject([]);
	
  constructor() { }
  
  public message(text, title?) {
  	if (!title) title = 'Message';
  	// this.notifications.push(text);
  	this.notifications.next(
  		this.notifications.getValue().concat(
  			new Notification(text, title)
  		)
  	);
  	console.log(this.notifications);
  }
  
  public error(text, title?) {
  	if (!title) title = 'Error';
  	// this.notifications.push(text);
  	this.notifications.next(
  		this.notifications.getValue().concat(
  			new Notification(text, title)
  		)
  	);
  	console.log(this.notifications);
  }
  
  public close(notificationIndex) {
  	let newNotifications = this.notifications.getValue();
  	newNotifications.splice(notificationIndex, 1);
  	this.notifications.next(newNotifications);
  }

}
