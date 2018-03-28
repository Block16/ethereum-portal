import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { LoadingIconComponent } from './loading-icon/loading-icon.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    ModalComponent,
    LoadingIconComponent
  ],
  declarations: [
    ModalComponent,
    LoadingIconComponent
  ]
})
export class SharedModule { }
