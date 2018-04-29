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

import { EditComponent } from './edit/edit.component';
import { ProfileComponent } from './profile/profile.component';
import { EventCreateComponent } from './eventCreate/eventCreate.component';

import { SlickModule } from 'ngx-slick';
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
import { TicketsComponent } from './tickets/tickets.component';
import { VenueCreateComponent } from './venueCreate/venueCreate.component';
import { FanCreateComponent } from './fan-create/fan-create.component';
import { ShowsDetailComponent } from './showsDetail/shows.Detail.component';
import { MessagesComponent } from './messages/messages.component';
import { MyTicketComponent } from './my-ticket/my-ticket.component';
import { MyTicketOpenedComponent } from './my-ticket-opened/my-ticket-opened.component';
import { BiographyComponent } from './biography/biography.component';
import { ByTicketComponent } from './buyTicket/buyTicket.component';
import { OneCardComponent } from './eventCreate/one-card/one-card.component';
import { OneFolowerForProfileComponent } from './one-folower-for-profile/one-folower-for-profile.component';
import { TicketOnProfileComponent } from './ticket-on-profile/ticket-on-profile.component';
import { UpcomingShowsProfileComponent } from './upcoming-shows-profile/upcoming-shows-profile.component';
import { VenueMediaPhotoComponent } from './venueCreate/venueImage/venueImage.component';
import { ShowDetailVideoComponent } from './showsDetail/video/video.component';
import { AboutComponent } from './eventCreate/about/about.component';
import { ArtistComponent } from './eventCreate/artist/artist.component';
import { VenuesComponent } from './eventCreate/venues/venues.component';
import { FundingComponent } from './eventCreate/funding/funding.component';
import { AddTicketsComponent } from './eventCreate/tickets/tickets.component';
import { VenueCreateModule } from './venueCreate/venueCreate.module';
import { EventCreateModule } from './eventCreate/eventCreate.module';
import { EventsModule } from './events/events.module';
import { ShowsModule } from './shows/shows.module';

@NgModule({
  declarations: [
    SystemComponent,
    EditComponent,
    ProfileComponent,
    AccountCreateComponent,
    ArtistCreateComponent,
    PreloaderComponent,
    FeedComponent,
    TicketsComponent,
    FanCreateComponent,
    ShowsDetailComponent,
    MessagesComponent,
    MyTicketComponent,
    MyTicketOpenedComponent,
    BiographyComponent,
    ByTicketComponent,
    OneFolowerForProfileComponent,
    TicketOnProfileComponent,
    UpcomingShowsProfileComponent,
    ShowDetailVideoComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    TextMaskModule,
    VenueCreateModule,
    EventCreateModule,
    EventsModule,
    ShowsModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    ReactiveFormsModule,
    SystemRoutingModule,
    NguiAutoCompleteModule,
    NavbarModule,
    FooterModule,
    YoutubePlayerModule,
    // SlickModule.forRoot(),
    
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