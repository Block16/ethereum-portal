import {NgModule, Optional, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrezorConnectService} from './key-manager-services/trezor-connect.service';
import {LedgerService} from './key-manager-services/ledger.service';
import {HttpClientModule} from "@angular/common/http";
import {Web3Service} from "./web3.service";
import {DataShareService} from "./data-share.service";
import {ThemeService} from "./theme.service";
import {SharedModule} from "../shared/shared.module";
import {PrivateKeyService} from "./key-manager-services/private-key.service";
import {Block16Service} from "./block16.service";
import {UserPreferencesService} from "./user-preferences.service";
import {CoreKeyManagerService} from "./key-manager-services/core-key-manager.service";
import {MetamaskService} from "./key-manager-services/metamask.service";
import {DenominationService} from "./denomination.service";
import {TokenTickerService} from "./token-ticker.service";
import {NotificationService} from "./notification.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    DataShareService,
    Block16Service,
    LedgerService,
    PrivateKeyService,
    TrezorConnectService,
    ThemeService,
    UserPreferencesService,
    Web3Service,
    MetamaskService,
    CoreKeyManagerService,
    DenominationService,
    TokenTickerService,
    NotificationService
  ],
  declarations: []
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded.');
    }
  }
}
