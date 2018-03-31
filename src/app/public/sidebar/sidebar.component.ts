import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {Web3Service} from "../../core/web3.service";
import {DataShareService} from "../../core/data-share.service";
import {FormBuilder, FormGroup, FormsModule} from '@angular/forms';
import {ThemeService} from "../../core/theme.service";
import {ThemeSource} from "../../shared/model/theme-source";
import {Theme} from "../../shared/model/theme/theme";

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
  public selectedTheme = 'Default';

  // ui-elements
  public userPreferences = {};
  public recentTransactions = [];
  public showSidebar = false;
  private theme;

  // forms
  public themeForm: FormGroup;
  public denominationForm: FormGroup;

  @Input()
  set account(address: string) {
    this.address = address;
    console.log(this.address);
    if (this.address !== "") {

    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private dataShareService: DataShareService,
    private themeService: ThemeService
  ) {
    this.themes = this.themeService.themes;
    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;

      // Build the theme changing selector
      this.themeForm = this.formBuilder.group({
        'themePreferences': []
      });

      // Set the default to the theme we get back from the service
      this.themeForm.controls['themePreferences'].setValue(theme.name, {onlySelf: true});

      // Make sure we sub to changes in the theme
      this.themeChangeSubscription = this.themeForm.get('themePreferences').valueChanges.subscribe((themeName: string) => {
        this.themeService.setTheme(themeName);
      });
    });

    this.denominationForm = this.formBuilder.group({

    });

    this.dataShareService.recentTransactions.subscribe((value: any) => {
      this.recentTransactions = value;
    });

    this.dataShareService.userPreferences.subscribe((value: any) => {
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
  }

  updatePreferences() {
    this.dataShareService.userPreferences.next(this.userPreferences);
  }

  changeDenomination() {
    console.log('denomination');
    this.updatePreferences();
  }

  changeTheme() {
    this.updatePreferences();
  }

  setUserPreference(preference, setting) {
    this.userPreferences[preference] = setting;
    this.dataShareService.userPreferences.next(this.userPreferences);
  }
}
