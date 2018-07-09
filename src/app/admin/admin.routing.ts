import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminAccessGuard } from './admin.guard';
import { AccountsComponent } from './accounts/accounts.component';



const routes: Routes =
[
  { path: '', redirectTo: 'dashboard', pathMatch:'full'},
  { path:'',component:AdminComponent, children:
    [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AdminAccessGuard]},
      { path: 'accounts', component: AccountsComponent, canActivate: [AdminAccessGuard]}
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
