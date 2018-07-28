import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import * as moment from 'moment';
import { Timestamp } from 'rxjs';

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


    // Hours:string[] = [];
    // Minutes: string[] = [];

    Vars: string[] = [
        'AM', 'PM'
    ];


    // CurHour:string = '00';
    // CurMinutes: string = '00';
    CurVar:string = 'AM';

    CurTime: string = '';

    constructor()
    {
        // this.CurHour = '00';
        // this.CurMinutes = '00';
        this.CurVar = this.Vars[0];
        // this.Hours = [];
        // this.Minutes = []
        this.CurTime = '';
        
        // for(let i = 0; i< 12; i++)
        // {
        //     let hour = i.toString();
        //     if(i < 10)
        //     {
        //         hour = '0' + hour;
        //     }
        //     this.Hours.push(hour);

        //     let minute = (i*5).toString();
        //     if(i < 2)
        //     {
        //         minute = '0' + minute;
        //     }
        //     this.Minutes.push(minute);
        // }
    }

    ngOnChanges(changes: SimpleChanges): void {

        if(changes && changes.Time && changes.Time.currentValue)
        {
            let time = changes.Time.currentValue;

            let parts = time.split(':');

            let hours = +parts[0];
            this.CurVar = hours < 12 ? 'AM' : 'PM';
            let hoursStr:string = '' + (hours < 12 ? hours : (hours - 12));
            if(hoursStr.length < 2)
            {
                hoursStr = '0' + hoursStr;
            }

            let minutes = parts[1];
            if(minutes.length < 2)
            {
                minutes = '0' + minutes;
            }

            this.CurTime = hoursStr + ":" + minutes;
            // this.CurMinutes = parts[1];
            // if(this.CurMinutes.length < 2)
            //     this.CurMinutes = '0' + this.CurMinutes;

            // let hours = +parts[0];
            // this.CurVar = hours < 12 ? 'AM' : 'PM';

            // this.CurHour = '' + (hours < 12 ? hours : (hours - 12));
            // if(this.CurHour.length < 2)
            // {
            //     this.CurHour = '0' + this.CurHour;
            // }

        }
        

    }

    // OnHoursChange($event)
    // {
    //     this.CurHour = $event;

    //     this.EmitCurrTime();
    // }

    // OnMinutesChange($event)
    // {
    //     this.CurMinutes = $event;

    //     this.EmitCurrTime();
    // }

    OnVarsChange($event)
    {
        this.CurVar = $event;

        this.EmitCurrTime();
    }

    OnTimeChange($event)
    {
        this.CurTime = $event;

        this.EmitCurrTime();
    }

    EmitCurrTime()
    {
        
        
        let parts = this.CurTime.split(":");

        if(parts && parts.length == 2){
            let result = '';
            result += this.CurVar == "PM" ? (+parts[0] + 12): parts[0];

            result += ':' + parts[1];

            if(result.length == 5){
                this.onTimeChange.emit(result);
            }
        }
        
    }

    MaskTime(str: string)
    {    
        
        let mask =  [
            /[0-1]/, 
            (str && (+str[0]) > 0) ? /[0-1]/ : /\d/,
            ':', 
            /[0-5]/, 
            /\d/
        ];
        return{
            mask: mask,
            keepCharPositions: true,
            guide: false,
        };
    }

}