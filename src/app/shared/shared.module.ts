import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { LoadingIconComponent } from './loading-icon/loading-icon.component';
import { PrivateKeyFormComponent } from './private-key-form/private-key-form.component';
import { ReactiveFormsModule } from "@angular/forms";
import { ToggleSwitchComponent } from './ui/toggle-switch/toggle-switch.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ModalComponent,
    LoadingIconComponent,
    PrivateKeyFormComponent
  ],
  declarations: [
    ModalComponent,
    LoadingIconComponent,
    PrivateKeyFormComponent,
    ToggleSwitchComponent
  ]
})
export class SharedModule { }
