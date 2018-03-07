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

import { EditComponent } from './edit/edit.component';
import { ProfileComponent } from './profile/profile.component';
import { EventCreateComponent } from './eventCreate/eventCreate.component';

import { TextMaskModule } from 'angular2-text-mask';

import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AccountCreateComponent } from './accountCreate/accountCreate.component';

import { NavbarModule } from '../shared/navbar/navbar.module';
import { FooterModule } from '../shared/footer/footer.module';
import { YoutubePlayerModule } from 'ng2-youtube-player';

@NgModule({
  declarations: [
    SystemComponent,
    ShowsComponent,
    EditComponent,
    ProfileComponent,
    AccountCreateComponent,
    EventCreateComponent
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
    NguiAutoCompleteModule,
    NavbarModule,
    FooterModule,
    YoutubePlayerModule
  ],
  providers: [ SystemAccessGuard]
})
export class SystemModule {}

1