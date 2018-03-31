import {Component, OnDestroy, OnInit} from '@angular/core';
import { DataShareService } from "../../core/data-share.service";
import {Theme} from "../../shared/model/theme/theme";
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../core/theme.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnDestroy {
  public theme: Theme;
  private themeSubscription: Subscription;
  public ethereumAddress: string;
  private userPreferences;

  constructor(
    private dataShareService: DataShareService,
    private themeService: ThemeService
  ) {
    this.ethereumAddress = "";
    this.dataShareService.userPreferences.subscribe((value: any) => {
      this.userPreferences = value;

      this.themeSubscription = this.themeService.theme.subscribe(theme => {
        this.theme = theme;
      });
    });
  }

  public ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  public onAddressChange(event) {
    this.ethereumAddress = event;
  }
}
