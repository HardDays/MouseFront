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

@Component({
    selector: 'venue-dates-selector',
    templateUrl: './dates.component.html',
    styleUrls: ['./../venueCreate.component.css']
})
export class VenueDatesComponent extends BaseComponent implements OnInit,OnChanges {
    changedPrice: CalendarDate[] = [];
    disabledDays: CalendarDate[] = [];
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
        "performance_time_to": new FormControl("",[])
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
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.Venue = changes.Venue.currentValue;
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

        this.main.accService.UpdateMyAccount(this.VenueId,{dates:arr})
            .subscribe(
                (res:AccountGetModel) => {
                    this.Venue = this.main.accService.AccountModelToCreateAccountModel(res);
                    this.ChangeDates();
                }
            )
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
    ChangeDates()
    {
        let arr = [];
        for(let i in this.Venue.dates)
        {
            let item:VenueDatesModel = this.Venue.dates[i];
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

        // {
        //     mDate: moment('2018-07-11'),
        //     changed: true,
        //     dayPrice: 500,
        //     nightPrice: 600
    
        // },
        // {
        //     mDate: moment('2018-07-12'),
        //     changed: true,
        //     nightPrice: 300
    
        // }
    }
}
