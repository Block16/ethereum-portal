import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {Web3Service} from "../../core/web3.service";
import {DataShareService} from "../../core/data-share.service";
import {FormBuilder, FormGroup, FormsModule} from '@angular/forms';
import {ThemeService} from "../../core/theme.service";
import {ThemeSource} from "../../shared/model/theme-source";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public address: string;

  private themeSubscription: Subscription;
  public themes: any[];

  // preferences
  public manualGas = false;
  public viewGenerated = false;
  public darkMode = false;
  public selectedTheme = 'Default';

  // ui
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
    });


    this.themeForm = this.formBuilder.group({
      'themePreferences': [[]]
    });

    this.denominationForm = this.formBuilder.group({

    });

    this.dataShareService.recentTransactions.subscribe((value: any) => {
      this.recentTransactions = value;
    });

    this.dataShareService.userPreferences.subscribe((value: any) => {
      this.userPreferences = value;
      this.theme = this.dataShareService.getTheme(value['theme']);
    });

    this.dataShareService.showSidebar.subscribe((value: any) => {
      this.showSidebar = value;
    });

    this.address = "";
  }

  public ngOnInit(): void {

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
