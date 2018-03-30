import {NgModule, Optional, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrezorConnectService} from './trezor-connect.service';
import {LedgerService} from './ledger.service';
import {HttpClientModule} from "@angular/common/http";
import {Web3Service} from "./web3.service";
import {DataShareService} from "./data-share.service";
import {ThemeService} from "./theme.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    DataShareService,
    LedgerService,
    TrezorConnectService,
    ThemeService,
    Web3Service
  ],
  declarations: [
  
  ]
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded.');
    }
  }
}
