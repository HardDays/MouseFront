import { NgModule } from "../../../../node_modules/@angular/core";
import { RouterModule } from "../../../../node_modules/@angular/router";
import { CommonModule } from "../../../../node_modules/@angular/common";
import { FormsModule, ReactiveFormsModule } from "../../../../node_modules/@angular/forms";
import { TextMaskModule } from "../../../../node_modules/angular2-text-mask";
import { ErrorModule } from "../../shared/error/error.module";
import { PreloaderModule } from "../../shared/preloader/preloader.module";
import { GlobalSearchComponent } from "./search.component";
import { AccountsSearchComponent } from "./accounts/accounts.component";
import { OneAccountSearchComponent } from './accounts/one-account/one-account.component';
import { OneShowSearchComponent } from "./shows/one-show/one-show.component";
import { ShowsPreviewSearchComponent } from "./shows/shows-preview/shows-preview.component";
import { TimePipeModule } from "../../core/pipes/time.pipe/time.pipe.module";
import { AccountsFullSearchComponent } from './acounts-full/accounts-full.component';
import { AccountCardSearchComponent } from './acounts-full/account-card/account-card.component';
import { ShowsFullSearchComponent } from "./shows/shows-full/shows-full.component";
import { SearchEventsModule } from "../../shared/search/search.module";
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule, MatFormFieldModule } from "@angular/material";
import { BsDatepickerModule } from "../../../../node_modules/ngx-bootstrap";
import { AgmCoreModule } from "../../../../node_modules/@agm/core";
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';

@NgModule({
    imports: [ 
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextMaskModule,
        ErrorModule,
        PreloaderModule,
        TimePipeModule,
        SearchEventsModule,
        MatSelectModule,
        MatFormFieldModule,
        TranslateModule,
        BsDatepickerModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyDNxl1cQw-cqFs5sv0vGJYmW_Ew5qWKNCc",
            libraries: ["places"],
            language: 'en'
        }),
        Ng2AutoCompleteModule
    ],
    declarations: [ 
        GlobalSearchComponent,
        AccountsSearchComponent,
        OneAccountSearchComponent,
        OneShowSearchComponent,
        ShowsPreviewSearchComponent,
        AccountsFullSearchComponent,
        AccountCardSearchComponent,
        ShowsFullSearchComponent
    ],
    exports: [ GlobalSearchComponent ]
})
export class GlobalSearchModule {}