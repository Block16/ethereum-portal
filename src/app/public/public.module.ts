import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {SidebarComponent} from './sidebar/sidebar.component';
import {LayoutComponent} from './layout/layout.component';
import {IndexComponent} from './index/index.component';
import {PublicRoutingModule} from './public.routing';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { IntroComponent } from './intro/intro.component';


@NgModule({
  imports: [
    PublicRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    LayoutComponent,
    SidebarComponent,
    IndexComponent,
    TransactionListComponent,
    IntroComponent
  ],
  providers: [
    IndexComponent
  ]
})
export class PublicModule { }
