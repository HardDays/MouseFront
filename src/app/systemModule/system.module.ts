import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SystemRoutingModule } from './system.routing';

import { SystemAccessGuard } from './system.guard';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {SystemComponent} from './system.component';

import {ShowsComponent} from './shows/shows.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { EditComponent } from './edit/edit.component';

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
    ReactiveFormsModule,
    SystemRoutingModule,
  ],
  providers: [ SystemAccessGuard]
})
export class SystemModule {}

1