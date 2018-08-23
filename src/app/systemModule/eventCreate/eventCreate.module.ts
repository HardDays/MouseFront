import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { TinyCalendarComponent } from './preview-artist/tiny-calendar/tiny-calendar.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { TimePipeModule } from '../../core/pipes/time.pipe/time.pipe.module';
import { VenueCreateModule } from '../venueCreate/venueCreate.module';
import { TranslateModule } from '@ngx-translate/core';
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
            libraries: ["places"],
            language: 'en'
          }),
        ErrorModule,
        PreloaderModule,
        BsDatepickerModule.forRoot(),
        TimePipeModule,
        VenueCreateModule,
        TranslateModule
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
        PreviewVenueComponent,
        TinyCalendarComponent
        
    ],
    exports: [ EventCreateComponent ],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class EventCreateModule {}


  