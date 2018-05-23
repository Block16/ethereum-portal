import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Notification} from '../shared/model/notification';
import {isNullOrUndefined} from "util";

@Injectable()
export class NotificationService {

  public notifications = new BehaviorSubject([]);

  constructor() { }

  public message(text, title?, duration?) {
    if (isNullOrUndefined(title)) {
      title = 'Message';
    }

    // this.notifications.push(text);
    this.notifications.next(
      this.notifications.getValue().concat(
        new Notification(text, title, duration)
      )
    );
  }

  public error(text, title?, duration?) {
    if (isNullOrUndefined(title)) {
      title = 'Error';
    }

    // this.notifications.push(text);
    this.notifications.next(
      this.notifications.getValue().concat(
        new Notification(text, title, duration)
      )
    );
  }

  public close(notificationIndex) {
    const newNotifications = this.notifications.getValue();
    newNotifications.splice(notificationIndex, 1);
    this.notifications.next(newNotifications);
  }

}
