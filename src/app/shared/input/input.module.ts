import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateInput } from './date/date.input';

@NgModule({
    imports: [ 
        RouterModule,
        CommonModule,
        FormsModule
    ],
    declarations: [ 
        DateInput
    ],
    exports: [ 
        DateInput
     ]
})
export class InputModule {}