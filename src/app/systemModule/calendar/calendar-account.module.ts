import { CalendarComponent } from './calendar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { AgmCoreModule } from '@agm/core';

import { ErrorModule } from '../../shared/error/error.module';
import { PreloaderModule } from '../../shared/preloader/preloader.module';
import { MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule} from './../../shared/calendar/calendar.module';
import { InputModule } from '../../shared/input/input.module';
import { VenueCreateModule } from './../venueCreate/venueCreate.module';

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
        TranslateModule,
        InputModule,
        CalendarModule,
        VenueCreateModule
    ],
    declarations: [
        CalendarComponent
    ],
    exports: [ ]
})
export class CalendarAccountModule {}


