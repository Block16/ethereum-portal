import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { LoadingIconComponent } from './loading-icon/loading-icon.component';
import { PrivateKeyFormComponent } from './private-key-form/private-key-form.component';
import { ReactiveFormsModule } from "@angular/forms";
import { ToggleSwitchComponent } from './ui-elements/toggle-switch/toggle-switch.component';
import { UtcFileFormComponent } from './utc-file-form/utc-file-form.component';
import { MenuButtonComponent } from './ui-elements/menu-button/menu-button.component';
import { TransactionDotComponent } from './ui-elements/transaction-dot/transaction-dot.component';
import { ButtonComponent } from './ui-elements/button/button.component';
import { SendFormComponent } from './send-form/send-form.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { InputComponent } from './ui-elements/input/input.component';
import { ToggleSectionComponent } from './ui-elements/toggle-section/toggle-section.component';
import { NgxKjuaModule } from 'ngx-kjua';
import { SelectComponent } from './ui-elements/select/select.component';
import { HoverStyleComponent } from './ui-elements/hover-style/hover-style.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { InlineButtonComponent } from './ui-elements/inline-button/inline-button.component';
import { SplitDecimalPipe } from './pipes/split-decimal.pipe';
import { BigNumberToNumberPipe } from './pipes/big-number-to-number.pipe';
import { AssetDisplayComponent } from './asset-display/asset-display.component';
import { NotificationComponent } from './notification-list/notification/notification.component';
import {IntegerOnlyDirective} from "./directive/integer-only.directive";
import {NumberOnlyDirective} from "./directive/number-only.directive";
import { NavbarComponent } from './navbar/navbar.component';
import { ArrowComponent } from './ui-elements/arrow/arrow.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgxKjuaModule,
  ],
  exports: [
    ButtonComponent,
    ModalComponent,
    LoadingIconComponent,
    ToggleSwitchComponent,
    PrivateKeyFormComponent,
    UtcFileFormComponent,
    MenuButtonComponent,
    TransactionDotComponent,
    SendFormComponent,
    InlineSVGModule,
    InputComponent,
    ToggleSectionComponent,
    NgxKjuaModule,
    SelectComponent,
    HoverStyleComponent,
    NotificationListComponent,
    NotificationComponent,
    InlineButtonComponent,
    SplitDecimalPipe,
    BigNumberToNumberPipe,
    AssetDisplayComponent,
    IntegerOnlyDirective,
    NumberOnlyDirective,
    NavbarComponent,
    ArrowComponent,
    NewTransactionComponent
  ],
  declarations: [
    ModalComponent,
    LoadingIconComponent,
    PrivateKeyFormComponent,
    ToggleSwitchComponent,
    UtcFileFormComponent,
    MenuButtonComponent,
    TransactionDotComponent,
    ButtonComponent,
    SendFormComponent,
    InputComponent,
    ToggleSectionComponent,
    SelectComponent,
    HoverStyleComponent,
    NotificationListComponent,
    NotificationComponent,
    InlineButtonComponent,
    SplitDecimalPipe,
    BigNumberToNumberPipe,
    AssetDisplayComponent,
    IntegerOnlyDirective,
    NumberOnlyDirective,
    NavbarComponent,
    ArrowComponent,
    NewTransactionComponent
  ]
})
export class SharedModule { }
