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
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    SystemComponent,
    ShowsComponent,
    LoginComponent,
    RegistrationComponent,
    EditComponent
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
  ],
  providers: [ SystemAccessGuard]
})
export class SystemModule {}

1