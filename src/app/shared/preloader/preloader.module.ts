import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PreloaderComponent } from './preloader.component';

@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [ PreloaderComponent ],
    exports: [ PreloaderComponent ]
})

export class PreloaderModule {}