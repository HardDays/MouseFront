import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventCreateComponent } from './eventCreate.component';
import { AboutComponent } from './about/about.component';
import { ArtistComponent } from './artist/artist.component';
import { FundingComponent } from './funding/funding.component';
import { OneCardComponent } from './one-card/one-card.component';
import { AddTicketsComponent } from './tickets/tickets.component';
import { VenuesComponent } from './venues/venues.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { AgmCoreModule } from '@agm/core';
import { PrivateResComponent } from './private-res/private-res.component';
import { ErrorModule } from '../../shared/error/error.module';
import { PreloaderModule } from '../../shared/preloader/preloader.module';
import { PreviewArtistComponent } from './preview-artist/preview-artist.component';
import { PreviewVenueComponent } from './preview-venue/preview-venue.component';

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
        PreloaderModule
    ],
    declarations: [ 
        EventCreateComponent,
        AboutComponent,
        ArtistComponent,
        FundingComponent,
        OneCardComponent,
        AddTicketsComponent,
        VenuesComponent,
        PrivateResComponent,
        PreviewArtistComponent,
        PreviewVenueComponent
        
    ],
    exports: [ EventCreateComponent ]
})
export class EventCreateModule {}


  