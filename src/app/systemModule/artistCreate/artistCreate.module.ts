import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { AgmCoreModule } from '@agm/core';

import { ErrorModule } from '../../shared/error/error.module';
import { PreloaderModule } from '../../shared/preloader/preloader.module';
import { ArtistAboutComponent } from './artist-about/artist-about.component';
import { ArtistBookingComponent } from './artist-booking/artist-booking.component';
import { ArtistMediaComponent } from './artist-media/artist-media.component';
import { ArtistRidersComponent } from './artist-riders/artist-riders.component';
import { ArtistCreateComponent } from './artistCreate.component';
import { ProfileModule } from '../profile/profile.module';
import { TinyCalendarComponent } from './tiny-calendar/tiny-calendar.component';
import { AudioComponent } from './artist-media/audio/audio.component';
import { ArtistCalendarComponent } from './artist-calendar/artist-calendar.component';
import { RiderComponent } from './artist-riders/rider/rider.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material';


@NgModule({
    imports: [ 
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextMaskModule,
        MatSelectModule,
        MatFormFieldModule,
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyDNxl1cQw-cqFs5sv0vGJYmW_Ew5qWKNCc",
            libraries: ["places"]
          }),
        ErrorModule,
        PreloaderModule,
        ProfileModule    
    ],
    declarations: [
        ArtistAboutComponent,
        ArtistBookingComponent,
        ArtistMediaComponent,
        ArtistRidersComponent,
        ArtistCreateComponent,
        TinyCalendarComponent,
        AudioComponent,
        ArtistCalendarComponent,
        RiderComponent
        
    ],
    exports: [ ArtistCreateComponent ]
})
export class ArtistCreateModule {}


  