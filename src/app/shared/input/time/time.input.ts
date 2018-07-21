import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import * as moment from 'moment';
import { Timestamp } from '../../../../../node_modules/rxjs';

declare var $:any;
declare var ionRangeSlider:any;

@Component({
    selector: 'time-input',
    templateUrl: './time.input.html',
    styleUrls: ['./../input.module.css']
})
export class TimeInput implements OnChanges{
    
    @Input() Time: String;
    @Output() onTimeChange: EventEmitter<String> = new EventEmitter();


    Hours:string[] = [];
    Minutes: string[] = [];

    Vars: string[] = [
        'AM', 'PM'
    ];


    CurHour:string = '00';
    CurMinutes: string = '00';
    CurVar:string = 'AM';

    constructor()
    {
        this.CurHour = '00';
        this.CurMinutes = '00';
        this.CurVar = 'AM';
        this.Hours = [];
        this.Minutes = []
        
        for(let i = 0; i< 12; i++)
        {
            let hour = i.toString();
            if(i < 10)
            {
                hour = '0' + hour;
            }
            this.Hours.push(hour);

            let minute = (i*5).toString();
            if(i < 2)
            {
                minute = '0' + minute;
            }
            this.Minutes.push(minute);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {

        if(changes && changes.Time && changes.Time.currentValue)
        {
            let time = changes.Time.currentValue;

            let parts = time.split(':');

            this.CurMinutes = parts[1];
            if(this.CurMinutes.length < 2)
                this.CurMinutes = '0' + this.CurMinutes;

            let hours = +parts[0];
            this.CurVar = hours < 12 ? 'AM' : 'PM';

            this.CurHour = '' + (hours < 12 ? hours : (hours - 12));
            if(this.CurHour.length < 2)
            {
                this.CurHour = '0' + this.CurHour;
            }

        }
        

    }

    OnHoursChange($event)
    {
        this.CurHour = $event;

        this.EmitCurrTime();
    }

    OnMinutesChange($event)
    {
        this.CurMinutes = $event;

        this.EmitCurrTime();
    }

    OnVarsChange($event)
    {
        this.CurVar = $event;

        this.EmitCurrTime();
    }

    EmitCurrTime()
    {
        let result = '';
        
        result += this.CurVar == "PM" ? (+this.CurHour + 12): this.CurHour;

        result += ':' + this.CurMinutes;

        this.onTimeChange.emit(result);
    }

}