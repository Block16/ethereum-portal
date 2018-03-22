import {NgModule, Optional, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrezorConnectService} from './trezor-connect.service';
import {LedgerService} from './ledger.service';
import {HttpClientModule} from "@angular/common/http";
import {Web3Service} from "./web3.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    TrezorConnectService,
    LedgerService,
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
