import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material';

import { InputModule } from '../../shared/input/input.module';
import { NoticeInputComponent } from './dates/notice/notice';
import { BigCalendarComponent } from './big-calendar/big-calendar.component';

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
        MatSelectModule,
        MatFormFieldModule,
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
        NoticeInputComponent,
        BigCalendarComponent
    ],
    exports: [ VenueCreateComponent, BigCalendarComponent],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class VenueCreateModule {}


  