import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VenueCreateComponent } from './venueCreate.component';
import { VenueAboutComponent } from './about/about.component';
import { VenueDatesComponent } from './dates/dates.component';
import { VenueHoursComponent } from './hours/hours.component';
import { VenueListingComponent } from './listing/listing.component';
import { VenueMediaComponent } from './media/media.component';
import { VenueMediaPhotoComponent } from './venueImage/venueImage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
    imports: [ 
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextMaskModule
    ],
    declarations: [ 
        VenueCreateComponent,
        VenueAboutComponent,
        VenueDatesComponent,
        VenueHoursComponent,
        VenueListingComponent,
        VenueMediaComponent,
        VenueMediaPhotoComponent
    ],
    exports: [ VenueCreateComponent ]
})
export class VenueCreateModule {}


  