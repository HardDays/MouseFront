import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BigCalendarComponent } from './big-calendar/big-calendar.component';
import { TinyCalendarComponent } from './tiny-calendar/tiny-calendar.component';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { InputModule } from '../input/input.module';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
    imports: [FormsModule, RouterModule, CommonModule, TranslateModule, InputModule, TextMaskModule ],
    declarations: [ BigCalendarComponent, TinyCalendarComponent],
    exports: [ BigCalendarComponent, TinyCalendarComponent]
})

export class CalendarModule {}
