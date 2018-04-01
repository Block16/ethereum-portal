import {Component, OnDestroy, OnInit} from '@angular/core';
import { DataShareService } from "../../core/data-share.service";
import {Theme} from "../../shared/model/theme/theme";
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../core/theme.service";
import {UserPreferencesService} from "../../core/user-preferences.service";
import {UserPreferences} from "../../shared/model/user-preferences";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnDestroy {
  public theme: Theme;
  private themeSubscription: Subscription;
  public ethereumAddress: string;
  public userPreferences: UserPreferences;
  public userPrefSubscription: Subscription;

  constructor(
    private userPreferencesService: UserPreferencesService,
    private dataShareService: DataShareService,
    private themeService: ThemeService
  ) {
    this.ethereumAddress = "";

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

  public onAddressChange(event) {
    this.ethereumAddress = event;
  }
}
