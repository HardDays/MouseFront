import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SystemRoutingModule } from './system.routing';
import { SystemAccessGuard } from './system.guard';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {SystemComponent} from './system.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { TimepickerModule } from 'ngx-bootstrap';
import {ShowsComponent} from './shows/shows.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { EditComponent } from './edit/edit.component';
import { ProfileComponent } from './profile/profile.component';
import { TextMaskModule } from 'angular2-text-mask';

import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AccountCreateComponent } from './accountCreate/accountCreate.component';


@NgModule({
  declarations: [
    SystemComponent,
    ShowsComponent,
    LoginComponent,
    RegistrationComponent,
    EditComponent,
    ProfileComponent,
    AccountCreateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    TextMaskModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    ReactiveFormsModule,
    SystemRoutingModule,
    NguiAutoCompleteModule
  ],
  providers: [ SystemAccessGuard]
})
export class SystemModule {}

1