import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateInput } from './date/date.input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material';

@NgModule({
    imports: [ 
        RouterModule,
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatFormFieldModule,
    ],
    declarations: [ 
        DateInput
    ],
    exports: [ 
        DateInput
     ]
})
export class InputModule {}