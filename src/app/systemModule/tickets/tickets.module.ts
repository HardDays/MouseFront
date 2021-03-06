import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import { BsDatepickerModule } from 'ngx-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { PreloaderModule } from '../../shared/preloader/preloader.module';
import { TicketsComponent } from './tickets.component';
import { MyTicketComponent } from './my-ticket/my-ticket.component';
import { SearchTicketsMapComponent } from './map/map.component';
import { SearchTicketsComponent } from './search/search.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
    imports: [ 
        RouterModule,
        CommonModule,
        FormsModule,
        BsDatepickerModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyDNxl1cQw-cqFs5sv0vGJYmW_Ew5qWKNCc",
            libraries: ["places"],
            language: 'en'
        }),
        PreloaderModule,
        InfiniteScrollModule,
        TranslateModule
    ],
    declarations: [ 
        TicketsComponent,
        MyTicketComponent,
        SearchTicketsMapComponent,
        SearchTicketsComponent
    ],
    exports: [ TicketsComponent ]
})
export class SearchTicketsModule {}