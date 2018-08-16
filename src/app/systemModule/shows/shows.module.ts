import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import { BsDatepickerModule } from 'ngx-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { ShowsComponent } from './shows.component';
import { ShowItemComponent } from './show/show.component';
import { PreloaderModule } from '../../shared/preloader/preloader.module';
import { SearchEventsModule } from '../../shared/search/search.module';

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
        SearchEventsModule
    ],
    declarations: [ 
        ShowsComponent,
        ShowItemComponent
    ],
    exports: [ ShowsComponent ]
})
export class ShowsModule {}