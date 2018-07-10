import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminAccessGuard } from './admin.guard';
import { AccountsComponent } from './accounts/accounts.component';
import { EventsComponent } from './events/events.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AccountComponent } from './accounts/account/account.component';



const routes: Routes =
[
  { path: '', redirectTo: 'dashboard', pathMatch:'full'},
  { path:'',component:AdminComponent, children:
    [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AdminAccessGuard]},
      { path: 'accounts/:id', component: AccountsComponent, canActivate: [AdminAccessGuard]},
      { path: 'account/:id', component: AccountComponent, canActivate: [AdminAccessGuard]},
      { path: 'events/:id', component: EventsComponent, canActivate: [AdminAccessGuard]},
      { path: 'feedback/:id', component: FeedbackComponent, canActivate: [AdminAccessGuard]}
    ]
  }
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
export class AdminRoutingModule { }
