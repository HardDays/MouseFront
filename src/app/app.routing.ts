import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AppAccessGuard } from './app.guard';
import { StupidAccessComponent } from './stupidAccess/stupidAccess.component';
import { LoginComponent } from './access/login/login.component';
import { RegistrationComponent } from './access/registration/registration.component';
import { SocialNewAccComponent } from './access/login/social-new-acc/social-new-acc.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';

const routes: Routes = [
    // { path: '', redirectTo: 'access', pathMatch:'full'},
    { path: '', redirectTo: 'system/shows', pathMatch:'full'},
    // { path: 'access',component: StupidAccessComponent, canActivate: [AppAccessGuard]},
    { path: 'login',component: LoginComponent, canActivate: [AppAccessGuard]},
    { path: 'social',component: SocialNewAccComponent, canActivate: [AppAccessGuard]},
    { path: 'register',component: RegistrationComponent, canActivate: [AppAccessGuard]},
    { path: 'system', loadChildren: './systemModule/system.module#SystemModule'},
    { path: 'admin', loadChildren: './admin/admin.module#AdminModule'},
    { path: '**', redirectTo: 'system/shows'}
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
  ],
  exports: [
  ],
  providers: []
})
export class AppRoutingModule { }
