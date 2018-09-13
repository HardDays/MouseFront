import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ErrorComponent } from './error.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [ RouterModule, CommonModule, TranslateModule ],
    declarations: [ ErrorComponent ],
    exports: [ ErrorComponent ]
})

export class ErrorModule {}
