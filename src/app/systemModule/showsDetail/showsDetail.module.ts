import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { PreloaderModule } from '../../shared/preloader/preloader.module';
import { AgmCoreModule } from '@agm/core';
import { ShowDetailGalleryComponent } from './gallery/gallery.component';
import { ShowsDetailComponent } from './showsDetail.component';
import { ShowDetailVideoComponent } from './video/video.component';
import { ByTicketComponent } from './buyTicket/buyTicket.component';
import { BiographyComponent } from './biography/biography.component';
import { ErrorModule } from '../../shared/error/error.module';
import {SlideshowModule} from 'ng-simple-slideshow';
import { TranslateModule } from '@ngx-translate/core';
import { InformationComponent } from './information/information.component';
import { ShowDetailRoutingModule } from './showDetail.routing';
import { CommentsComponent } from './comments/comments.component';
import { UpdatesComponent } from './updates/updates.component';
import { ArtistInfoComponent } from './artist-info/artist-info.component';
import { OneCommentComponent } from './one-comment/one-comment.component';
import { OneAvaWhoGoingComponent } from './one-ava-who-going/one-ava-who-going.component';
import { OneHumanGoingModalComponent } from './one-human-going-modal/one-human-going-modal.component';
import { PaymentShowDetailComponent } from './payment/payment.component';
import { Data } from './showDetail.data';


@NgModule({
    imports: [ 
        RouterModule,
        CommonModule,
        FormsModule,
        ShowDetailRoutingModule,
        ReactiveFormsModule,
        TextMaskModule,
        PreloaderModule,
        ErrorModule,
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyDNxl1cQw-cqFs5sv0vGJYmW_Ew5qWKNCc",
            libraries: ["places"]
        }),
        SlideshowModule,
        TranslateModule
    ],
    declarations: [ 
        ShowsDetailComponent,
        ShowDetailVideoComponent,
        ShowDetailGalleryComponent,
        ByTicketComponent,
        BiographyComponent,
        InformationComponent,
        CommentsComponent,
        UpdatesComponent,
        ArtistInfoComponent,
        OneCommentComponent,
        OneAvaWhoGoingComponent,
        OneHumanGoingModalComponent,
        PaymentShowDetailComponent
    ],
    exports: [ ShowsDetailComponent,ShowDetailGalleryComponent ],
    providers:[Data]
})
export class ShowsDetailModule {}