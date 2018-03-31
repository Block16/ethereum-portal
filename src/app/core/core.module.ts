import {NgModule, Optional, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrezorConnectService} from './trezor-connect.service';
import {LedgerService} from './ledger.service';
import {HttpClientModule} from "@angular/common/http";
import {Web3Service} from "./web3.service";
import {DataShareService} from "./data-share.service";
import {ThemeService} from "./theme.service";
import {SharedModule} from "../shared/shared.module";
import {PrivateKeyService} from "./private-key.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    DataShareService,
    LedgerService,
    PrivateKeyService
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
