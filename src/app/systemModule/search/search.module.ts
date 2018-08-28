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

@NgModule({
    imports: [ 
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextMaskModule,
        ErrorModule,
        PreloaderModule
    ],
    declarations: [ 
        GlobalSearchComponent,
        AccountsSearchComponent,
        OneAccountSearchComponent
    ],
    exports: [ GlobalSearchComponent ]
})
export class GlobalSearchModule {}