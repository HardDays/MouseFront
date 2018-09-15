import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { InformationComponent } from './information/information.component';
import { ShowsDetailComponent } from './showsDetail.component';
import { CommentsComponent } from './comments/comments.component';
import { UpdatesComponent } from './updates/updates.component';
import { PaymentShowDetailComponent } from './payment/payment.component';




const routes: Routes =
[
  { path: '', component:ShowsDetailComponent, pathMatch:'full'},
  { path: 'start_purchase', component: PaymentShowDetailComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class ShowDetailRoutingModule { }
