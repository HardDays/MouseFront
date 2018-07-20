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
import { RevenueComponent } from './revenue/revenue.component';
import { SettingsComponent } from './settings/settings.component';
import { AddNewAdminComponent } from './settings/add-new-admin/add-new-admin.component';
import { RevenueInfoComponent } from './revenue/revenue-info/revenue-info.component';
import { FeedbackAnalyticsComponent } from './feedback/feedback-analytics/feedback-analytics.component';
import { CustomerSupportComponent } from './customer-support/customer-support.component';
import { CustomerSupportAnswersComponent } from './customer-support/customer-support-answers/customer-support-answers.component';
import { RevenueAnalyticsComponent } from './revenue/revenue-analytics/revenue-analytics.component';
import { EventComponent } from './events/event/event.component';



const routes: Routes =
[
  { path: '', redirectTo: 'dashboard', pathMatch:'full'},
  { path:'',component:AdminComponent, children:
    [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AdminAccessGuard]},
      { path: 'accounts/:id', component: AccountsComponent, canActivate: [AdminAccessGuard]},
      { path: 'account/:id', component: AccountComponent},
      { path: 'events/:id', component: EventsComponent, canActivate: [AdminAccessGuard]},
      { path: 'event/:id', component: EventComponent},
      { path: 'feedback', component: FeedbackComponent, canActivate: [AdminAccessGuard]},
      { path: 'feedback/analytics', component: FeedbackAnalyticsComponent, canActivate: [AdminAccessGuard]},
      { path: 'revenues', component: RevenueComponent, canActivate: [AdminAccessGuard]},
      { path: 'revenues/analytics', component: RevenueAnalyticsComponent, canActivate: [AdminAccessGuard]},
      { path: 'revenue/:id', component: RevenueInfoComponent, canActivate: [AdminAccessGuard]},
      { path: 'customer', component: CustomerSupportComponent, canActivate: [AdminAccessGuard]},
      { path: 'customer/answers', component: CustomerSupportAnswersComponent, canActivate: [AdminAccessGuard]},
      { path: 'settings', component: SettingsComponent, canActivate: [AdminAccessGuard]},
      { path: 'add-admin', component: AddNewAdminComponent, canActivate: [AdminAccessGuard]}
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
