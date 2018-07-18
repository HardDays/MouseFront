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
import { ErrorComponent } from '../../shared/error/error.component';
import { ErrorModule } from '../../shared/error/error.module';
import { PreloaderModule } from '../../shared/preloader/preloader.module';
import { ProfileModule } from '../profile/profile.module';
import { BigCalendarComponent } from './big-calendar/big-calendar.component';
import { InputModule } from '../../shared/input/input.module';

@NgModule({
    imports: [ 
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextMaskModule,
        ErrorModule,
        PreloaderModule,
        ProfileModule,
        InputModule
    ],
    declarations: [ 
        VenueCreateComponent,
        VenueAboutComponent,
        VenueDatesComponent,
        VenueHoursComponent,
        VenueListingComponent,
        VenueMediaComponent,
        VenueMediaPhotoComponent,
        BigCalendarComponent
    ],
    exports: [ VenueCreateComponent ]
})
export class VenueCreateModule {}


  