import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {Web3Service} from "../../core/web3.service";
import {DataShareService} from "../../core/data-share.service";
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public address: string;
  
  // preferences
  public manualGas: boolean = false;
  public viewGenerated: boolean = false;
  public darkMode: boolean = false;
  public selectedTheme = 'Default';
  
  // ui
  public userPreferences = {};
  public recentTransactions = [];
  public showSidebar: boolean = false;
  private theme;

  @Input()
  set account(address: string) {
    this.address = address;
    console.log(this.address);
    if (this.address !== "") {

    }
  }
  updatePreferences() {
    this.dataShareService.userPreferences.next(this.userPreferences);
  }
  
  
  changeDemonination() {
    console.log('denomination')
    this.updatePreferences();
  }
  
  changeTheme() {
    this.updatePreferences();
  }
  
  setUserPreference(preference, setting) {
    this.userPreferences[preference] = setting;
    this.dataShareService.userPreferences.next(this.userPreferences);
  }

  constructor(private web3Service: Web3Service,
    private dataShareService: DataShareService) {
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
}
