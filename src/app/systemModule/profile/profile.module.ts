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
import { VenueProfileComponent } from './vanue/venue.component';
import { AgmCoreModule } from '@agm/core';


@NgModule({
    imports: [ 
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextMaskModule,
        PreloaderModule,
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyDNxl1cQw-cqFs5sv0vGJYmW_Ew5qWKNCc",
            libraries: ["places"]
        })
    ],
    declarations: [ 
        //компоненты
        ProfileComponent,
        OneFolowerForProfileComponent,
        TicketOnProfileComponent,
        UpcomingShowsProfileComponent,
        FanProfileComponent,
        VenueProfileComponent
       
      

    ],
    exports: [ ProfileComponent, VenueProfileComponent ]
})
export class ProfileModule {}


  