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
    AppRoutingModule
  ],
  providers: [AppAccessGuard, MainService, HttpModule, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
