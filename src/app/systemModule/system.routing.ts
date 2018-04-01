import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { SystemAccessGuard } from './system.guard';
import { SystemComponent } from './system.component';

<<<<<<< HEAD
import { ShowsComponent } from './shows/shows.component';
import { EditComponent } from './edit/edit.component';
import { ProfileComponent } from './profile/profile.component';
import { AccountCreateComponent } from './accountCreate/accountCreate.component';
import { EventCreateComponent } from './eventCreate/eventCreate.component';
import { ArtistCreateComponent } from './artistCreate/artistCreate.component';
import { EventsComponent } from './events/events.component';
=======
import {OpenComponent} from './test-open/open.component';
import { EditUserComponent } from './editUser/editUser.component';

>>>>>>> 8edf63aebbfb7c94c69783b424d17269f62cb14a

const routes: Routes =
[
  { path: '', redirectTo: 'shows', pathMatch:'full'},
  { path:'',component:SystemComponent, children:
    [
<<<<<<< HEAD
      { path: 'shows', component: ShowsComponent, canActivate: [SystemAccessGuard] },
      { path: 'edit/:id', component: EditComponent, canActivate: [SystemAccessGuard] },
      { path: 'profile/:id', component: ProfileComponent, canActivate: [SystemAccessGuard] },
      { path: 'accountCreate', component: AccountCreateComponent, canActivate: [SystemAccessGuard] },
      { path: 'events', component: EventsComponent, canActivate: [SystemAccessGuard] },
      { path: 'eventCreate/:id', component: EventCreateComponent, canActivate: [SystemAccessGuard] },
      { path: 'eventCreate', component: EventCreateComponent, canActivate: [SystemAccessGuard] },
      { path: 'artistCreate', component: ArtistCreateComponent, canActivate: [SystemAccessGuard] }
=======
      { path: 'open', component: OpenComponent, canActivate: [SystemAccessGuard] },
      { path: 'edit', component: EditUserComponent, canActivate: [SystemAccessGuard] }
>>>>>>> 8edf63aebbfb7c94c69783b424d17269f62cb14a
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
