import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

import { BsDatepickerModule } from 'ngx-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { ShowsComponent } from './shows.component';
import { ShowItemComponent } from './show/show.component';
import { SearchShowsComponent } from './search/search.component';
import { MapShowsComponent } from './map/map.component';

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
    ],
    declarations: [ 
        ShowsComponent,
        ShowItemComponent,
        SearchShowsComponent,
        MapShowsComponent
    ],
    exports: [ ]
})
export class ShowsModule {}