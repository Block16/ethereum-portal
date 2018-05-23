import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../core/notification.service';
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../core/theme.service";
import {Theme} from "../../shared/model/theme/theme";

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  private notificationSubscription: Subscription;
  private themeSubscription: Subscription;
  public theme: Theme;

  public notifications = [];

  constructor(
    private notificationService: NotificationService,
    private themeService: ThemeService,
  ) {
    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
    });

    this.notificationSubscription = this.notificationService.notifications.subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  ngOnInit() { }
}
