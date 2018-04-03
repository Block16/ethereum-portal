import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {Web3Service} from "../../core/web3.service";
import {DataShareService} from "../../core/data-share.service";
import {FormBuilder, FormGroup, FormsModule} from '@angular/forms';
import {ThemeService} from "../../core/theme.service";
import {Theme} from "../../shared/model/theme/theme";
import {UserPreferencesService} from "../../core/user-preferences.service";
import {UserPreferences} from "../../shared/model/user-preferences";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnDestroy {
  public address: string;

  private themeSubscription: Subscription;
  private themeChangeSubscription: Subscription;
  public themes: Theme[];

  // preferences
  public manualGas = false;
  public viewGenerated = false;
  public darkMode = false;

  // ui-elements
  public userPreferences: UserPreferences;
  public userPrefSubscription: Subscription;
  public recentTransactions = [];
  public showSidebar = false;
  public theme: Theme;

  // forms
  public themeForm: FormGroup;
  public denominationForm: FormGroup;

  @Input()
  set account(address: string) {
    this.address = address;
  }

  constructor(
    private formBuilder: FormBuilder,
    private dataShareService: DataShareService,
    private userPreferencesService: UserPreferencesService,
    private themeService: ThemeService
  ) {
    this.themes = this.themeService.themes;
    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
      this.themeService.updateSVGs(theme.primaryColor, theme.secondaryColor);
    });

    // Build the theme changing selector
    this.themeForm = this.formBuilder.group({
      'themePreferences': []
    });

    // Set the default to the theme we get back from the service
    // this.themeForm.controls['themePreferences'].setValue(theme.name, {onlySelf: true});

    // Make sure we sub to changes in the theme
    this.themeChangeSubscription = this.themeForm.get('themePreferences').valueChanges.subscribe((themeName: string) => {
      this.themeService.setTheme(themeName);
      // this.themeForm.controls['themePreferences'].setValue(themeName, {onlySelf: true});
    });

    this.denominationForm = this.formBuilder.group({

    });

    this.dataShareService.recentTransactions.subscribe((value: any) => {
      this.recentTransactions = value;
    });

    this.userPrefSubscription = this.userPreferencesService.userPreferences.subscribe(value => {
      this.userPreferences = value;
    });

    this.dataShareService.showSidebar.subscribe((value: any) => {
      this.showSidebar = value;
    });

    this.address = "";
  }


  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
    this.themeChangeSubscription.unsubscribe();
    this.userPrefSubscription.unsubscribe();
  }

  setUserPreference(preference, setting) {
    this.userPreferences[preference] = setting;
    this.userPreferencesService.setPreferences(this.userPreferences);
  }
}
