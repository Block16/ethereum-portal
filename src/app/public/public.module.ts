import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {CoreModule} from '../core/core.module';
import {SidebarComponent} from './sidebar/sidebar.component';
import {LayoutComponent} from './layout/layout.component';
import {IndexComponent} from './index/index.component';
import {PublicRoutingModule} from './public.routing';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  imports: [
    PublicRoutingModule,
    CommonModule,
    RouterModule,

    CoreModule,
    SharedModule,
  ],
  declarations: [
    LayoutComponent,
    SidebarComponent,
    IndexComponent
  ]
})
export class PublicModule { }
