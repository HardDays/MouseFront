import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import { BsDatepickerModule } from 'ngx-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { PreloaderModule } from '../preloader/preloader.module';
import { SearchEventsComponent } from './search_window/search.component';
import { SearchEventsMapComponent } from './map/map.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material';

@NgModule({
    imports: [ 
        RouterModule,
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatFormFieldModule,
        BsDatepickerModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyDNxl1cQw-cqFs5sv0vGJYmW_Ew5qWKNCc",
            libraries: ["places"]
        }),
        PreloaderModule,
        InfiniteScrollModule
    ],
    declarations: [ 
        SearchEventsComponent, SearchEventsMapComponent
    ],
    exports: [ SearchEventsComponent, SearchEventsMapComponent ]
})
export class SearchEventsModule {}