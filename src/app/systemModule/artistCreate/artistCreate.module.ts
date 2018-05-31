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


@NgModule({
    imports: [ 
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextMaskModule,
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
        ArtistCreateComponent
        
    ],
    exports: [ ArtistCreateComponent ]
})
export class ArtistCreateModule {}


  