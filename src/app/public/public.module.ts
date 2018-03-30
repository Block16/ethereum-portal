import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {SidebarComponent} from './sidebar/sidebar.component';
import {LayoutComponent} from './layout/layout.component';
import {IndexComponent} from './index/index.component';
import {PublicRoutingModule} from './public.routing';
import {SharedModule} from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { TransactionListComponent } from './transaction-list/transaction-list.component';


@NgModule({
  imports: [
    PublicRoutingModule,
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    LayoutComponent,
    SidebarComponent,
    IndexComponent,
    TransactionListComponent
  ],
  providers: [
    IndexComponent
  ]
})
export class PublicModule { }
