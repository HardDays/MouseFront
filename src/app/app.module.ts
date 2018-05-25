import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef  } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
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
import { TextMaskModule } from 'angular2-text-mask';

import { Angular2SocialLoginModule } from "angular2-social-login";
import { AgmCoreModule } from '@agm/core';
import { LoginComponent } from './access/login/login.component';
import { RegistrationComponent } from './access/registration/registration.component';
import { EventService } from './core/services/event.service';
import { CommonModule } from '@angular/common';
import { RegisterUserComponent } from './access/registration/register-user/register-user.component';
import { RegisterAccComponent } from './access/registration/register-acc/register-acc.component';
import { RegisterFollowComponent } from './access/registration/register-follow/register-follow.component';
import { RegisterPhoneComponent } from './access/registration/register-phone/register-phone.component';
import { PhoneService } from './core/services/phone.service';
import { MainService } from './core/services/main.service';
import { PreloaderModule } from './shared/preloader/preloader.module';
import { ErrorModule } from './shared/error/error.module';
import { SocialNewAccComponent } from './access/login/social-new-acc/social-new-acc.component';



let providers = {
  "google": {
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
    StupidAccessComponent,
    LoginComponent,
    RegistrationComponent,
    RegisterUserComponent,
    RegisterAccComponent,
    RegisterFollowComponent,
    RegisterPhoneComponent,
    SocialNewAccComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AppRoutingModule,
    Angular2SocialLoginModule,
    ReactiveFormsModule,
    TextMaskModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDNxl1cQw-cqFs5sv0vGJYmW_Ew5qWKNCc",
      libraries: ["places"]
    }),
    PreloaderModule,
    ErrorModule
  ],
  providers: [
    AppAccessGuard, 
    AuthMainService,
    TypeService, 
    ImagesService,
    AccountService,
    GenresService,
    EventService,
    PhoneService,
    HttpModule,
    HttpService,
    MainService
  ],
    bootstrap: [AppComponent],
    
})
export class AppModule { }

Angular2SocialLoginModule.loadProvidersScripts(providers);