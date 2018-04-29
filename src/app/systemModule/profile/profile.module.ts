import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { ProfileComponent } from './profile.component';
import { OneFolowerForProfileComponent } from './one-folower-for-profile/one-folower-for-profile.component';
import { TicketOnProfileComponent } from './ticket-on-profile/ticket-on-profile.component';
import { UpcomingShowsProfileComponent } from './upcoming-shows-profile/upcoming-shows-profile.component';
import { FunProfileComponent } from './fun-profile/fun-profile.component';
import { ArtistProfileComponent } from './artist-profile/artist-profile.component';
import { VenueProfileComponent } from './venue-profile/venue-profile.component';

@NgModule({
    imports: [ 
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextMaskModule
    ],
    declarations: [ 
        //компоненты
        ProfileComponent,
        OneFolowerForProfileComponent,
        TicketOnProfileComponent,
        UpcomingShowsProfileComponent,
        FunProfileComponent,
        ArtistProfileComponent,
        VenueProfileComponent
    ],
    exports: [ ProfileComponent ]
})
export class ProfileModule {}


  