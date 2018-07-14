import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { SystemAccessGuard } from './system.guard';
import { SystemComponent } from './system.component';

import { ShowsComponent } from './shows/shows.component';
import { ProfileComponent } from './profile/profile.component';
import { EventCreateComponent } from './eventCreate/eventCreate.component';
import { ArtistCreateComponent } from './artistCreate/artistCreate.component';
import { EventsComponent } from './events/events.component';
import { FeedComponent } from './feed/feed.component';
import { TicketsComponent } from './tickets/tickets.component';
import { VenueCreateComponent } from './venueCreate/venueCreate.component';
import { FanCreateComponent } from './fan-create/fan-create.component';
import { ShowsDetailComponent } from './showsDetail/showsDetail.component';
import { MessagesComponent } from './messages/messages.component';
import { MyTicketOpenedComponent } from './my-ticket-opened/my-ticket-opened.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes =
[
  { path: '', redirectTo: 'shows', pathMatch:'full'},
  { path:'',component:SystemComponent, children:
    [
      { path: 'shows', component: ShowsComponent,  canActivate: [SystemAccessGuard]},
      { path: 'profile/:id', component: ProfileComponent, canActivate: [SystemAccessGuard] },
      { path: 'events', component: EventsComponent, canActivate: [SystemAccessGuard] },
      { path: 'eventCreate/:id', component: EventCreateComponent, canActivate: [SystemAccessGuard] },
      { path: 'fanCreate/:id', component: FanCreateComponent, canActivate: [SystemAccessGuard] },
      { path: 'artistCreate/:id', component: ArtistCreateComponent, canActivate: [SystemAccessGuard] },
      { path: 'venueCreate/:id', component: VenueCreateComponent, canActivate: [SystemAccessGuard] },
      { path: 'feed', component: FeedComponent, canActivate: [SystemAccessGuard] },
      { path: 'tickets', component: TicketsComponent, canActivate: [SystemAccessGuard] },
      { path: 'shows_detail/:id', component: ShowsDetailComponent, canActivate: [SystemAccessGuard] },
      { path: 'tickets/:id', component: MyTicketOpenedComponent, canActivate: [SystemAccessGuard] },
      { path: 'messages', component: MessagesComponent, canActivate: [SystemAccessGuard] },
      { path: 'settings', component: SettingsComponent, canActivate: [SystemAccessGuard] }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class SystemRoutingModule { }
