import {NgModule, Optional, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrezorConnectService} from './trezor-connect.service';
import {LedgerService} from './ledger.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    TrezorConnectService,
    LedgerService
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
