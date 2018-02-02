import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AppAccessGuard } from '../app/app.guard';
import { LoginComponent } from '../app/login/login.component';
import { RegistrationComponent } from '../app/registration/registration.component';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch:'full'},
    { path: 'login',component: LoginComponent, canActivate: [AppAccessGuard]},
    { path: 'register',component: RegistrationComponent, canActivate: [AppAccessGuard]},
    { path: 'system', loadChildren: './systemModule/system.module#SystemModule'},


    { path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
  providers: []
})
export class AppRoutingModule { }
