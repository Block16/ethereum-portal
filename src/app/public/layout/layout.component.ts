import {Component, OnDestroy} from '@angular/core';
import {Theme} from "../../shared/model/theme/theme";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../core/theme.service";
import {UserPreferencesService} from "../../core/user-preferences.service";
import {UserPreferences} from "../../shared/model/user-preferences";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  host: {
    '[style.background]': `this.theme.secondaryColor`
  }
})
export class LayoutComponent implements OnDestroy {

  public theme: Theme;
  public userPreferences: UserPreferences;
  public userPrefSubscription: Subscription;
  public showSidebar: boolean;

  private themeSubscription: Subscription;

  constructor(
    private userPreferencesService: UserPreferencesService,
    private themeService: ThemeService,
  ) {
    this.showSidebar = false;

    this.userPrefSubscription = this.userPreferencesService.userPreferences.subscribe(value => {
      this.userPreferences = value;
    });

    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
    });
    
  }

  public ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
    this.userPrefSubscription.unsubscribe();
  }

  public showSidebarChange(b: boolean) {
    this.showSidebar = b;
  }
  
  public onResize() {
    
  }
}
