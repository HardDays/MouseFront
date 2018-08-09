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

import { ProfileComponent } from './profile/profile.component';
import { EventCreateComponent } from './eventCreate/eventCreate.component';

import { SlickModule } from 'ngx-slick';
import { TextMaskModule } from 'angular2-text-mask';

import { NguiAutoCompleteModule } from '@ngui/auto-complete';

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
import { MessagesComponent } from './messages/messages.component';
import { MyTicketOpenedComponent } from './my-ticket-opened/my-ticket-opened.component';
import { OneCardComponent } from './eventCreate/one-card/one-card.component';
import { VenueMediaPhotoComponent } from './venueCreate/venueImage/venueImage.component';
import { ShowDetailVideoComponent } from './showsDetail/video/video.component';
import { AboutComponent } from './eventCreate/about/about.component';
import { ArtistComponent } from './eventCreate/artist/artist.component';
import { VenuesComponent } from './eventCreate/venues/venues.component';
import { FundingComponent } from './eventCreate/funding/funding.component';
import { AddTicketsComponent } from './eventCreate/tickets/tickets.component';
import { VenueCreateModule } from './venueCreate/venueCreate.module';
import { ProfileModule } from './profile/profile.module';
import { EventCreateModule } from './eventCreate/eventCreate.module';
import { EventsModule } from './events/events.module';
import { ShowsModule } from './shows/shows.module';
import { ErrorModule } from '../shared/error/error.module';
import { PreloaderModule } from '../shared/preloader/preloader.module';
import { ArtistCreateModule } from './artistCreate/artistCreate.module';
import { ByTicketComponent } from './showsDetail/buyTicket/buyTicket.component';
import { ShowDetailGalleryComponent } from './showsDetail/gallery/gallery.component';
import { ShowsDetailModule } from './showsDetail/showsDetail.module';
import { SearchTicketsModule } from './tickets/tickets.module';
import { SettingsModule } from './settings/settings.module';
import { FeedItemComponent } from './feed/feed-item/feed-item.component';
import { FeedModule } from './feed/feed.module';
import { MessageRequestComponent } from './messages/message-request/message-request.component';
import { MessageAcceptComponent } from './messages/message-accept/message-accept.component';
import { MessageBlankComponent } from './messages/message-blank/message-blank.component';
import { MessageSupportComponent } from './messages/message-support/message-support.component';



@NgModule({
  declarations: [
    SystemComponent,
    FanCreateComponent,
    MessagesComponent,
    MyTicketOpenedComponent,
    MessageRequestComponent,
    MessageAcceptComponent,
    MessageBlankComponent,
    MessageSupportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    TextMaskModule,
    VenueCreateModule,
    ProfileModule,
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
    ErrorModule,
    PreloaderModule,
    ArtistCreateModule,
    ShowsDetailModule,
    SearchTicketsModule,
    SettingsModule,
    FeedModule,
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