import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { AgmCoreModule } from '@agm/core';

import { ErrorModule } from '../shared/error/error.module';
import { PreloaderModule } from '../shared/preloader/preloader.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminRoutingModule } from './admin.routing';
import { AdminAccessGuard } from './admin.guard';
import { AccountsComponent } from './accounts/accounts.component';
import { TableComponent } from './accounts/table/table.component';
import { AnalyticsComponent } from './accounts/analytics/analytics.component';
import { EventsComponent } from './events/events.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AccountComponent } from './accounts/account/account.component';
import { RevenueComponent } from './revenue/revenue.component';
import { SettingsComponent } from './settings/settings.component';
import { AddNewAdminComponent } from './settings/add-new-admin/add-new-admin.component';
import { RevenueInfoComponent } from './revenue/revenue-info/revenue-info.component';
import { RevenueAnalyticsComponent } from './revenue/revenue-analytics/revenue-analytics.component';
import { FeedbackAnalyticsComponent } from './feedback/feedback-analytics/feedback-analytics.component';
import { CustomerSupportComponent } from './customer-support/customer-support.component';
import { CustomerSupportAnswersComponent } from './customer-support/customer-support-answers/customer-support-answers.component';
import { AnalyticsEventComponent } from './events/analytics-event/analytics-event.component';
import { EventComponent } from './events/event/event.component';
import { ArtistComponent } from './accounts/account/artist/artist.component';
import { VenueComponent } from './accounts/account/venue/venue.component';
import { TinyCalendarComponent } from './accounts/account/artist/tiny-calendar/tiny-calendar.component';
import { SlideshowModule } from 'ng-simple-slideshow';
import { FanComponent } from './accounts/account/fan/fan.component';
import { TicketComponent } from './accounts/account/fan/ticket/ticket.component';
import { OneFollowerComponent } from './accounts/account/fan/one-follower/one-follower.component';
import { ChartsModule } from 'ng2-charts';
import { FundingComponent } from './accounts/funding/funding.component';
import { AnalyticCardComponent } from './revenue/revenue-analytics/analytic-card/analytic-card.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material';
import { VenueCreateModule } from '../systemModule/venueCreate/venueCreate.module';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { InvitesComponent } from './accounts/invites/invites.component';
import { MessagesComponent } from './messages/messages.component';
import { NotificationComponent } from './notification/notification.component';
import { NewMessageComponent } from './messages/new-message/new-message.component';
import { OpenMessageComponent } from './messages/open-message/open-message.component';
import { ListMessageComponent } from './messages/list-message/list-message.component';
import { NewBugComponent } from './notification/new-bug/new-bug.component';
import { NewAdminComponent } from './notification/new-admin/new-admin.component';
import { NewUsersComponent } from './notification/new-users/new-users.component';



@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        AdminRoutingModule,
        ReactiveFormsModule,
        TextMaskModule,
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyDNxl1cQw-cqFs5sv0vGJYmW_Ew5qWKNCc",
            libraries: ["places"],
            language: 'en'
          }),
        ErrorModule,
        PreloaderModule,
        SlideshowModule,
        ChartsModule,
        MatSelectModule,
        MatFormFieldModule,
        VenueCreateModule,
        InfiniteScrollModule
    ],
    declarations: [
        AdminComponent,
        DashboardComponent,
        AccountsComponent,
        TableComponent,
        AnalyticsComponent,
        EventsComponent,
        FeedbackComponent,
        AccountComponent,
        RevenueComponent,
        SettingsComponent,
        AddNewAdminComponent,
        RevenueInfoComponent,
        RevenueAnalyticsComponent,
        FeedbackAnalyticsComponent,
        CustomerSupportComponent,
        CustomerSupportAnswersComponent,
        AnalyticsEventComponent,
        EventComponent,
        ArtistComponent,
        VenueComponent,
        TinyCalendarComponent,
        FanComponent,
        TicketComponent,
        OneFollowerComponent,
        FundingComponent,
        AnalyticCardComponent,
        InvitesComponent,
        MessagesComponent,
        NotificationComponent,
        NewMessageComponent,
        OpenMessageComponent,
        ListMessageComponent,
        NewBugComponent,
        NewAdminComponent,
        NewUsersComponent

    ],
    providers: [AdminAccessGuard]
})
export class AdminModule {}


