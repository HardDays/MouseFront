import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import * as moment from 'moment';
import { Timestamp } from 'rxjs';
import { SettingsService } from '../../../core/services/settings.service';
import { TimeFormat } from '../../../core/models/preferences.model';

declare var $:any;
declare var ionRangeSlider:any;

@Component({
    selector: 'time-input',
    templateUrl: './time.input.html',
    styleUrls: ['./../input.module.css']
})
export class TimeInput implements OnChanges{

    @Input() Time: String;
    @Input() disabled:boolean = false;
    @Output() onTimeChange: EventEmitter<String> = new EventEmitter();

    Format: string = TimeFormat.EURO;

    Vars: string[] = [
        'AM', 'PM'
    ];

    CurVar:string = 'AM';

    CurTime: string = '';

    constructor(protected settings: SettingsService)
    {
        this.CurVar = this.Vars[0];
        this.CurTime = '';
        this.Format = this.settings.GetTimeFormat();
        this.settings.SettingsChange.subscribe(
            (Val) => {
                if(Val)
                {
                    this.Format = this.settings.GetTimeFormat();
                }
            }
        );
    }

    ngOnChanges(changes: SimpleChanges): void {

        if(changes && changes.Time && changes.Time.currentValue)
        {
            this.Format = this.settings.GetTimeFormat();
            let time = changes.Time.currentValue;
            if(this.Format != TimeFormat.CIS)
            {
                let parts = time.split(':');

                let hours = +parts[0];
                this.CurVar = hours < 12 ? 'AM' : 'PM';
                let hoursStr:string = (hours % 12).toString();
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
            }
            else{
                this.CurTime = time;
            }

        }


    }

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
        if(this.Format != TimeFormat.CIS)
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
        else if (this.CurTime.length == 5)
        {
            this.onTimeChange.emit(this.CurTime);
        }


    }

    MaskTime(str: string)
    {
        let mask = [];
        if(this.Format != TimeFormat.CIS)
        {
            mask.push(/[0-1]/);
            mask.push((str && (+str[0]) > 0) ? /[0-1]/ : /\d/);
        }
        else{
            mask.push(/[0-2]/);
            mask.push((str && (+str[0]) > 1) ? /[0-3]/ : /\d/);
        }
        mask.push(':',/[0-5]/,/\d/);
        return{
            mask: mask,
            keepCharPositions: true,
            guide: false,
        };
    }

}
