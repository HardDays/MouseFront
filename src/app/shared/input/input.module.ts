import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateInput } from './date/date.input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material';
import { TextMaskModule } from '../../../../node_modules/angular2-text-mask';
import { TimeInput } from './time/time.input';


@NgModule({
    imports: [ 
        
        RouterModule,
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatFormFieldModule,
        TextMaskModule
    ],
    declarations: [ 
        DateInput,
        TimeInput
    ],
    exports: [ 
        DateInput,
        TimeInput
     ]
})
export class InputModule {}