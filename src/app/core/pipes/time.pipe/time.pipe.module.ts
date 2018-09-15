import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { TimePipe } from "./time.pipe";

@NgModule({
    imports: [ 
        CommonModule
    ],
    declarations: [ 
        TimePipe
    ],
    exports: [ 
        TimePipe
     ]
})
export class TimePipeModule {}