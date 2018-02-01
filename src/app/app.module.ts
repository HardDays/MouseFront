import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { MainService } from './core/services/main.service';
import { HttpService } from './core/services/http.service';

import { AppComponent } from './app.component';
import { AppAccessGuard } from './app.guard';
import { AppRoutingModule } from './app.routing';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from '../app/registration/registration.component';

import { Angular2SocialLoginModule } from "angular2-social-login";

let providers = {
  "google": {
    "clientId": "318975976374-aibqel7otlqho284pfc62iofel2e6s58.apps.googleusercontent.com"
  },
  "linkedin": {
    "clientId": "LINKEDIN_CLIENT_ID"
  },
  "facebook": {
    "clientId": "187849948634661",
    "apiVersion": "v2.11" //like v2.4 
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AppRoutingModule,
    Angular2SocialLoginModule
  ],
  providers: [AppAccessGuard, MainService, HttpModule, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }

Angular2SocialLoginModule.loadProvidersScripts(providers);