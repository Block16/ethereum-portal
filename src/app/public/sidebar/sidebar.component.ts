import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {Web3Service} from "../../core/web3.service";
import {DataShareService} from "../../core/data-share.service";
import {FormBuilder, FormGroup, FormsModule} from '@angular/forms';
import {ThemeService} from "../../core/theme.service";
import {Theme} from "../../shared/model/theme/theme";
import {UserPreferencesService} from "../../core/user-preferences.service";
import {UserPreferences} from "../../shared/model/user-preferences";
import {Provider} from "../../shared/model/providers";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnDestroy {
  public address: string;
  public providers: Provider[];
  public currentProvider: Provider;

  private providerSubscription: Subscription;
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
  public providerForm: FormGroup;
  private denominationChangeSubscription: Subscription;
  private providerChangeSubscription: Subscription;
  public denominations = [
    'None', 'USD', 'EUR'
  ];

  @Input()
  set account(address: string) {
    this.address = address;
  }

  constructor(
    private formBuilder: FormBuilder,
    private dataShareService: DataShareService,
    private web3Service: Web3Service,
    private userPreferencesService: UserPreferencesService,
    private themeService: ThemeService
  ) {
    this.providers = this.web3Service.getProviders();
    this.themes = this.themeService.themes;
    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
      this.themeService.updateSVGs(theme);
    });

    // Build the theme changing selector
    this.themeForm = this.formBuilder.group({
      'themePreferences': []
    });

    this.denominationForm = this.formBuilder.group({
      'additionalDenomination': []
    });

    this.providerForm = this.formBuilder.group({
      'provider': []
    });

    // Set the default to the theme we get back from the service
    // this.themeForm.controls['themePreferences'].setValue(theme.name, {onlySelf: true});

    this.providerSubscription = this.web3Service.currentProvider.subscribe((provider: Provider) => {
      this.currentProvider = provider;
    });

    this.themeChangeSubscription = this.themeForm.get('themePreferences').valueChanges.subscribe((theme: Theme) => {
      this.themeService.setTheme(theme.name);
    });

    this.denominationChangeSubscription = this.denominationForm.get('additionalDenomination').valueChanges.subscribe((denomination) => {
      this.userPreferences['additionalDenomination'] = denomination;
      this.userPreferencesService.setPreferences(this.userPreferences);
    });

    this.providerChangeSubscription = this.providerForm.get('provider').valueChanges.subscribe((provider: Provider) => {
      this.web3Service.setCurrentProvider(provider);
      this.userPreferences['provider'] = provider.name;
      // TODO: Where do we want to centralize this logic?
      this.userPreferencesService.setPreferences(this.userPreferences);
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
    this.providerChangeSubscription.unsubscribe();
    this.providerSubscription.unsubscribe();
  }

  setUserPreference(preference, setting) {
    this.userPreferences[preference] = setting;
    this.userPreferencesService.setPreferences(this.userPreferences);
  }
}
