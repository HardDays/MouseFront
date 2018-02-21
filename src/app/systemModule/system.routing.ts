import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { SystemAccessGuard } from './system.guard';
import { SystemComponent } from './system.component';

import { ShowsComponent } from './shows/shows.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { EditComponent } from './edit/edit.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes =
[
  { path: '', redirectTo: 'shows', pathMatch:'full'},
  { path:'',component:SystemComponent, children:
    [
      { path: 'shows', component: ShowsComponent, canActivate: [SystemAccessGuard] },
      { path: 'login', component: LoginComponent, canActivate: [SystemAccessGuard] },
      { path: 'register', component: RegistrationComponent, canActivate: [SystemAccessGuard] },
      { path: 'edit', component: EditComponent, canActivate: [SystemAccessGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [SystemAccessGuard] }
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
export class SystemRoutingModule { }
