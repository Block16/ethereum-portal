import {Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit} from '@angular/core';
import {EthereumAsset} from "../model/ethereum-asset";

@Component({
  selector: 'app-asset-display',
  templateUrl: './asset-display.component.html',
  styleUrls: ['./asset-display.component.scss']
})
export class AssetDisplayComponent {
  public nonGreyValue: string;
  public greyValue: string;

  @Input()
  set ethereumAsset(a: EthereumAsset) {
    const amount = a.calculatedAmount.toString(10);
    const index = amount.indexOf(".");
    this.greyValue = "";

    if (index !== -1) {
      this.nonGreyValue = amount.substring(0, index + 3);
      this.greyValue = amount.substring(index + 4);
    } else {
      this.greyValue = amount;
    }
  }

  constructor() {
    this.greyValue = "";
    this.nonGreyValue = "";
  }
}
