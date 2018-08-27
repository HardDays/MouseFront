import { NgModule } from "../../../../node_modules/@angular/core";
import { RouterModule } from "../../../../node_modules/@angular/router";
import { CommonModule } from "../../../../node_modules/@angular/common";
import { FormsModule, ReactiveFormsModule } from "../../../../node_modules/@angular/forms";
import { TextMaskModule } from "../../../../node_modules/angular2-text-mask";
import { ErrorModule } from "../../shared/error/error.module";
import { PreloaderModule } from "../../shared/preloader/preloader.module";
import { GlobalSearchComponent } from "./search.component";

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
        GlobalSearchComponent
    ],
    exports: [ GlobalSearchComponent ]
})
export class GlobalSearchModule {}