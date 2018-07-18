import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import * as moment from 'moment';

declare var $:any;
declare var ionRangeSlider:any;

@Component({
    selector: 'date-input',
    templateUrl: './date.input.html'
})
export class DateInput implements OnChanges {
    @Input() Label: String;
    @Input() DateInput: Date;
    @Output() OnDateChange: EventEmitter<Date> = new EventEmitter<Date>();

    DayNumbers:number[] = [];
    MonthArray:string[] = [];
    YearArray: number[] = [];

    CurrentMoment = moment();

    Day:number = 0;
    Month:number = 0;
    Year:number = 0;

    ngOnChanges(changes: SimpleChanges): void 
    {
        if(this.DateInput)
        {
            this.CurrentMoment = moment(this.DateInput);
            
        this.CheckMoments();
        }
    }

    CheckMoments()
    {
        this.Day = this.CurrentMoment.date();
        this.Month = this.CurrentMoment.month();
        this.Year = this.CurrentMoment.year();
        this.GetDaysOfCurrentMonth();
        this.GetMonthArray();
        this.GetYearArray();
        
    }

    GetDaysOfCurrentMonth()
    {
        let days = this.CurrentMoment.daysInMonth();
        this.DayNumbers = [];
        for(let i = 0; i < days; ++i)
        {
            this.DayNumbers.push(i+1);
        }
        if(this.Day > days)
        {
            this.Day = days;
        }
    }

    GetMonthArray()
    {
        this.MonthArray = moment.monthsShort();
    }

    GetYearArray()
    {
        this.YearArray = [];
        let year = this.CurrentMoment.year();
        for(let i = 0; i<5; ++i)
        {
            this.YearArray.push(year+i);
        }
    }

    YearChanges($event)
    {
        this.Year = $event;
        this.CurrentMoment.year(this.Year);
        this.GetDaysOfCurrentMonth();
        this.DateEmit();
    }

    MonthChanges($event)
    {
        this.Month = $event;
        this.CurrentMoment.month(this.Month);
        this.GetDaysOfCurrentMonth();
        this.DateEmit();
    }

    DateChanges($event)
    {
        this.Day = $event;
        this.CurrentMoment.date(this.Day);
        this.DateEmit();
    }

    DateEmit()
    {
        this.OnDateChange.emit(this.CurrentMoment.toDate());
    }


}