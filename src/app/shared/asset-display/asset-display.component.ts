import {Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit} from '@angular/core';
import {EthereumAsset} from "../model/ethereum-asset";
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../core/theme.service";
import {Theme} from "../model/theme/theme";

@Component({
  selector: 'app-asset-display',
  templateUrl: './asset-display.component.html',
  styleUrls: ['./asset-display.component.scss'],
  host: {
    '[class]': '"no-wrap lining-proportional"',
  }
})
export class AssetDisplayComponent {
  public nonGrayValue: string;
  public nonGrayValueNumber: number;
  public grayValue: string;
  
  public theme: Theme;
  private themeSubscription: Subscription;

  @Input()
  set ethereumAsset(a: EthereumAsset) {
    const amount = a.calculatedAmount.toString(10);
    const index = amount.indexOf(".");
    this.grayValue = "";

    if (index !== -1) {
      this.nonGrayValueNumber = Number(amount.substring(0, index + 3));
      this.grayValue = amount.substring(index + 4);
    } else {
      this.grayValue = amount;
    }
  }
  constructor(private themeService: ThemeService) {
    
    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
    });
    
    this.grayValue = "";
    this.nonGrayValue = "";
  }
}
