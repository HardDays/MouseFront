import { Component, Input, OnInit, ElementRef, EventEmitter, ViewChild, NgZone, Output, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AccountCreateModel } from '../../../core/models/accountCreate.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { ContactModel } from '../../../core/models/contact.model';
import {BaseMessages} from '../../../core/base/base.enum';
import { BigCalendarComponent, CalendarDate } from '../big-calendar/big-calendar.component';
import * as moment from 'moment';
import { VenueDatesModel } from '../../../core/models/venueDatesModel';
import { AccountGetModel } from '../../../core/models/accountGet.model';

declare var $:any;

@Component({
    selector: 'venue-dates-selector',
    templateUrl: './dates.component.html',
    styleUrls: ['./../venueCreate.component.css']
})
export class VenueDatesComponent extends BaseComponent implements OnInit,OnChanges {
    changedPrice: CalendarDate[] = [];
    disabledDays: CalendarDate[] = [];
    eventsDates:CalendarDate[] = [];
    type_min_time_to_book:string = '';
    @Input() VenueId: number;
    @Input() Venue: AccountCreateModel;
    @Output() onSaveVenue:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();
    @Output() onError:EventEmitter<string> = new EventEmitter<string>();
    @Output() onVenueChanged:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();



    dateForm : FormGroup = new FormGroup({
        "minimum_notice": new FormControl("",[Validators.pattern("[0-9]+"),
                                Validators.min(0),Validators.max(999)]),
        "is_flexible": new FormControl("",[]),
        "price_for_daytime": new FormControl("",[Validators.required,Validators.pattern("[0-9]+"),
                                Validators.min(0),Validators.max(1000000)]),
        "price_for_nighttime": new FormControl("",[Validators.required,Validators.pattern("[0-9]+"),
                                Validators.min(0),Validators.max(1000000)]),
        "performance_time_from": new FormControl("",[]),
        "performance_time_to": new FormControl("",[]),
        "minimum_notice_text": new FormControl("",[])
    });

    CreateOnModelChangeForParent()
    {
        this.dateForm.valueChanges.forEach(
            (value:any) => {
                this.onVenueChanged.emit(this.Venue);
            });
    }
    ngOnInit(): void
    {
        this.CreateOnModelChangeForParent();
        this.ChangeDates();
    }

    ngOnChanges(changes: SimpleChanges): void {
        //this.Venue = changes.Venue.currentValue;
        this.ChangeDates();
    }

    SaveVenue()
    {
        this.dateForm.updateValueAndValidity();
        
        if(this.dateForm.invalid)
        {
            this.onError.emit(this.getFormErrorMessage(this.dateForm, 'venue'));
            return;
        }
        $('html,body').animate({
            scrollTop: 0
        }, 0);
        this.onSaveVenue.emit(this.Venue);
    }

    GetPerformanceFromTimeMask(venue:AccountCreateModel)
    {
        return {
        mask: [/[0-2]/, (venue.performance_time_from && (+venue.performance_time_from[0]) > 1) ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
        keepCharPositions: true
        };
    }
    GetPerformanceToTimeMask(venue:AccountCreateModel)
    {
        return {
        mask: this.main.typeService.GetEndTimeMask(venue.performance_time_from,venue.performance_time_to),
        keepCharPositions: true
        };
    }
    GetMinimumNoticeMask()
    {
        return {
        mask: [/[1-9]/,/[0-9]/,/[0-9]/],
        keepCharPositions: true,
        guide:false
        };
    }

    GetPerfomancePriceMask()
    {
        return {
        mask: [/[1-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/],
        keepCharPositions: true,
        guide:false
        };
    }

    

    SaveDates($event)
    {
        let arr:VenueDatesModel[] = [];
        let curr_date = moment($event.from);
        let end_date = moment($event.to);
        arr.push(this.CalendarFormToVenueDate(curr_date.toDate(),$event));
        if($event.date_range){
            curr_date.date(curr_date.date() +1);
            while(curr_date <= end_date){
                arr.push(this.CalendarFormToVenueDate(curr_date.toDate(),$event));
                curr_date.date(curr_date.date() +1);
            }
        }
        this.main.accService.SaveVenueDatesAsArray(this.VenueId, {dates: arr})
            .subscribe(
                (res: any) => {
                    this.ChangeDates();
                }
            );
    }

    CalendarFormToVenueDate(date:Date, data:any)
    {
        let model = new VenueDatesModel();
        model.date = date;
        model.is_available = data.is_available;
        if(model.is_available)
        {
            model.price_for_daytime = data.price_for_daytime;
            model.price_for_nighttime = data.price_for_nighttime;
        }
        return model;
    }
    ChangeDates(NewDate?:Date)
    {
        let params = null;
        if(NewDate){
            params = {
                current_date: NewDate
            };
        }

        this.changedPrice = [];
        this.disabledDays = [];
        this.eventsDates = [];
        if(this.VenueId){
            this.main.accService.GetVenueDates(this.VenueId,params)
            .subscribe(
                (res:any) => {
                    let arr = [];
                    console.log(res);
                    for(let i in res.dates)
                    {
                        let item:VenueDatesModel = res.dates[i];
                        let date = {
                            mDate: moment(item.date),
                            selected: !item.is_available,
                            dayPrice: item.price_for_daytime,
                            nightPrice: item.price_for_nighttime,
                            changed:true
                        };
                        arr.push(date);
                    }
                    this.changedPrice = arr.filter(obj => !obj.selected);
                    this.disabledDays = arr.filter(obj => obj.selected);

                    if(res.event_dates)
                    {
                        
                        for(let item of res.event_dates)
                        {
                            this.eventsDates.push({
                                mDate: moment(item.date_from),
                                event: true,
                                eventId: item.id
                            });
                        }
                    }
                }
            );
        }
        
        

        
        
    }
}
