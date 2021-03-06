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
import { RecentTransactionComponent } from './sidebar/recent-transaction/recent-transaction.component';
import { TransactionEntryComponent } from './transaction-list/transaction-entry/transaction-entry.component';
import { TransactionService } from './transaction-list/transaction.service';
import { TransactionListLegendComponent } from './transaction-list/transaction-list-legend/transaction-list-legend.component';


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
    RecentTransactionComponent,
    TransactionEntryComponent,
    TransactionListLegendComponent
  ],
  providers: [
    IndexComponent,
    TransactionService
  ]
})
export class PublicModule { }
