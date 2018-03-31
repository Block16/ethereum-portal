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
import { SendFormComponent } from './send-form/send-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ModalComponent,
    LoadingIconComponent,
    ToggleSwitchComponent,
    PrivateKeyFormComponent,
    UtcFileFormComponent,
    MenuButtonComponent,
    TransactionDotComponent,
    SendFormComponent
  ],
  declarations: [
    ModalComponent,
    LoadingIconComponent,
    PrivateKeyFormComponent,
    ToggleSwitchComponent,
    UtcFileFormComponent,
    MenuButtonComponent,
    TransactionDotComponent,
    SendFormComponent
  ]
})
export class SharedModule { }
