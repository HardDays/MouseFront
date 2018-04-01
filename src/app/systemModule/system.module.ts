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
import { EventsComponent } from './events/events.component';

import { TextMaskModule } from 'angular2-text-mask';

import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AccountCreateComponent } from './accountCreate/accountCreate.component';

import { NavbarModule } from '../shared/navbar/navbar.module';
import { FooterModule } from '../shared/footer/footer.module';
import { PreloaderComponent } from '../shared/preloader/preloader.component';
import { YoutubePlayerModule } from 'ng2-youtube-player';
import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule } from '@agm/core';
import { ArtistCreateComponent } from './artistCreate/artistCreate.component';
import { FeedComponent } from './feed/feed.component';

@NgModule({
  declarations: [
    SystemComponent,
    ShowsComponent,
    EditComponent,
    ProfileComponent,
    AccountCreateComponent,
    EventCreateComponent,
    ArtistCreateComponent,
    EventsComponent,
    PreloaderComponent,
    FeedComponent
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
    YoutubePlayerModule,
    
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDNxl1cQw-cqFs5sv0vGJYmW_Ew5qWKNCc",
      libraries: ["places"]
    }),
      CommonModule,
      FormsModule
  ],
  providers: [ SystemAccessGuard]
})
export class SystemModule {}

1