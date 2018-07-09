import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { PreloaderModule } from '../../shared/preloader/preloader.module';
import { AgmCoreModule } from '@agm/core';
import { ShowDetailGalleryComponent } from '../showsDetail/gallery/gallery.component';
import { ShowsDetailComponent } from './showsDetail.component';
import { ShowDetailVideoComponent } from './video/video.component';
import { ByTicketComponent } from './buyTicket/buyTicket.component';
import { BiographyComponent } from './biography/biography.component';
import { ErrorModule } from '../../shared/error/error.module';
import {SlideshowModule} from 'ng-simple-slideshow';

@NgModule({
    imports: [ 
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextMaskModule,
        PreloaderModule,
        ErrorModule,
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyDNxl1cQw-cqFs5sv0vGJYmW_Ew5qWKNCc",
            libraries: ["places"]
        }),
        SlideshowModule
    ],
    declarations: [ 
        ShowsDetailComponent,
        ShowDetailVideoComponent,
        ShowDetailGalleryComponent,
        ByTicketComponent,
        BiographyComponent
    ],
    exports: [ ShowsDetailComponent,ShowDetailGalleryComponent ]
})
export class ShowsDetailModule {}