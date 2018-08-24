import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import {MatMenuModule} from '@angular/material/menu';


@NgModule({
    imports: [ RouterModule, CommonModule,FormsModule, TranslateModule, MatMenuModule ],
    declarations: [ NavbarComponent ],
    exports: [ NavbarComponent ]
})

export class NavbarModule {}
