import { CalendarComponent } from './calendar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { AgmCoreModule } from '@agm/core';

import { ErrorModule } from '../../shared/error/error.module';
import { PreloaderModule } from '../../shared/preloader/preloader.module';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { TinyCalendarComponentPrewiev } from './tiny-calendar/tiny-calendar.component';
import { BigCalendarComponentPreview } from './big-calendar/big-calendar.component';
import { InputModule } from '../../shared/input/input.module';
import { NoticeInputComponentPreview } from './big-calendar/notice/notice';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextMaskModule,
        MatSelectModule,
        MatFormFieldModule,
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyDNxl1cQw-cqFs5sv0vGJYmW_Ew5qWKNCc",
            libraries: ["places"],
            language: 'en'
          }),
        ErrorModule,
        PreloaderModule,
        TranslateModule,
        InputModule
    ],
    declarations: [
        CalendarComponent,
        TinyCalendarComponentPrewiev,
        BigCalendarComponentPreview,
        NoticeInputComponentPreview
    ],
    exports: [ CalendarComponent ]
})
export class CalendarModule {}


