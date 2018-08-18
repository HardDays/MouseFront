import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { ProfileComponent } from './profile.component';
import { OneFolowerForProfileComponent } from './one-folower-for-profile/one-folower-for-profile.component';
import { TicketOnProfileComponent } from './ticket-on-profile/ticket-on-profile.component';
import { UpcomingShowsProfileComponent } from './upcoming-shows-profile/upcoming-shows-profile.component';
import { PreloaderModule } from '../../shared/preloader/preloader.module';
import { FanProfileComponent } from './fan/fan.component';
import { VenueProfileComponent } from './venue/venue.component';
import { AgmCoreModule } from '@agm/core';
import { ArtistProfileComponent } from './artist/artist.component';
import { ShowDetailGalleryComponent } from '../showsDetail/gallery/gallery.component';
import { ShowsDetailModule } from '../showsDetail/showsDetail.module';
import { ErrorModule } from '../../shared/error/error.module';
import { TimePipeModule } from '../../core/pipes/time.pipe/time.pipe.module';
import { PhonePipe } from '../../core/pipes/phone.pipe';


@NgModule({
    imports: [ 
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextMaskModule,
        PreloaderModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDNxl1cQw-cqFs5sv0vGJYmW_Ew5qWKNCc',
            language: 'en'
        }),
        ShowsDetailModule,
        ErrorModule,
        TimePipeModule
    ],
    declarations: [
        // компоненты
        ProfileComponent,
        OneFolowerForProfileComponent,
        TicketOnProfileComponent,
        UpcomingShowsProfileComponent,
        FanProfileComponent,
        VenueProfileComponent,
        ArtistProfileComponent,
        PhonePipe
    ],
    exports: [ ProfileComponent, VenueProfileComponent, ArtistProfileComponent ]
})
export class ProfileModule {}
