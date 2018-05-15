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
  @Input() showSidebar: boolean;
  @Input() set account(address: string) {
    this.address = address;
  }

  public address: string;
  public providers: Provider[];
  public currentProvider: Provider;

  private providerSubscription: Subscription;
  private themeSubscription: Subscription;
  private themeChangeSubscription: Subscription;
  public themes: Theme[];

  // preferences
  public manualGas = false;
  public showGenerated = false;
  public darkMode = false;

  // ui-elements
  public userPreferences: UserPreferences;
  public userPrefSubscription: Subscription;
  public recentTransactions = [];
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

  constructor(
    private formBuilder: FormBuilder,
    private dataShareService: DataShareService,
    private web3Service: Web3Service,
    private userPreferencesService: UserPreferencesService,
    private themeService: ThemeService
  ) {
    this.providers = this.web3Service.getProviders();
    this.themes = this.themeService.themes;

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

    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
      this.themeService.updateSVGs(theme);
    });

    this.providerSubscription = this.web3Service.currentProvider.subscribe((provider: Provider) => {
      this.currentProvider = provider;
    });

    this.themeChangeSubscription = this.themeForm.get('themePreferences').valueChanges.subscribe((theme: Theme) => {
      this.themeService.setTheme(theme.name);
    });

    this.denominationChangeSubscription = this.denominationForm.get('additionalDenomination').valueChanges.subscribe((denomination) => {
      this.userPreferencesService.setAdditionalDenomination(denomination);
    });

    this.providerChangeSubscription = this.providerForm.get('provider').valueChanges.subscribe((provider: Provider) => {
      this.web3Service.setCurrentProvider(provider);
      this.userPreferencesService.setProvider(provider.name);
    });

    this.dataShareService.recentTransactions.subscribe((value: any) => {
      this.recentTransactions = value;
    });

    this.userPrefSubscription = this.userPreferencesService.userPreferences.subscribe(value => {
      this.userPreferences = value;
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

  toggleManualGas() {
    this.userPreferencesService.setManualGas(!this.userPreferences.manualGas);
  }

  toggleShowGenerated() {
    this.userPreferencesService.setShowGenerated(!this.userPreferences.showGenerated);
  }
}
