import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AuthMainService } from './core/services/auth.service';
import { TypeService } from './core/services/type.service';
import { ImagesService } from './core/services/images.service';
import { AccountService } from './core/services/account.service';
import { HttpService } from './core/services/http.service';
import { GenresService } from './core/services/genres.service';

import { AppComponent } from './app.component';
import { AppAccessGuard } from './app.guard';
import { AppRoutingModule } from './app.routing';

import { SystemComponent } from './systemModule/system.component';
import { StupidAccessComponent } from './stupidAccess/stupidAccess.component';

import { Angular2SocialLoginModule } from "angular2-social-login";

let providers = {
  "google": {

    //"clientId": "318975976374-aibqel7otlqho284pfc62iofel2e6s58.apps.googleusercontent.com"
    "clientId": "318975976374-kgoi5u5qrao13e6u7o2sjinleh5c86vj.apps.googleusercontent.com"
  },
  "facebook": {
    "clientId": "187849948634661",
    "apiVersion": "v2.11" //like v2.4 
  }
};

@NgModule({
  declarations: [
    AppComponent,
    StupidAccessComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AppRoutingModule,
    Angular2SocialLoginModule
  ],
  providers: [AppAccessGuard, 
    AuthMainService,
    TypeService, 
    ImagesService,
    AccountService,
    GenresService,
    HttpModule, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }

Angular2SocialLoginModule.loadProvidersScripts(providers);