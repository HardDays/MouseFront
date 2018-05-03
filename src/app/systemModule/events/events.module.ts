import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { EventsComponent } from './events.component';
import { MyEventComponent } from './myEvent/myEvent.component';

import { BsDatepickerModule } from 'ngx-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { SearchEventComponent } from './search/search.component';
import { MapEventComponent } from './map/map.component';
import { PreloaderModule } from '../../shared/preloader/preloader.module';
import { AnalyticsEventComponent } from './analytics/analytics.component';

@NgModule({
    imports: [ 
        RouterModule,
        CommonModule,
        FormsModule,
        BsDatepickerModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyDNxl1cQw-cqFs5sv0vGJYmW_Ew5qWKNCc",
            libraries: ["places"]
        }),
        PreloaderModule
    ],
    declarations: [ 
        EventsComponent,
        MyEventComponent,
        SearchEventComponent,
        MapEventComponent,
        AnalyticsEventComponent
    ],
    exports: [ EventsComponent]
})
export class EventsModule {}


  