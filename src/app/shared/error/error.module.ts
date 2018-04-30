import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ErrorComponent } from './error.component';

@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [ ErrorComponent ],
    exports: [ ErrorComponent ]
})

export class ErrorModule {}
