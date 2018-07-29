import { Component, Input, OnInit, ElementRef, EventEmitter, ViewChild, NgZone, Output, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AccountCreateModel } from '../../../core/models/accountCreate.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { ContactModel } from '../../../core/models/contact.model';
import { FrontWorkingTimeModel } from '../../../core/models/frontWorkingTime.model';

declare var $:any;
@Component({
    selector: 'venue-hours-selector',
    templateUrl: './hours.component.html',
    styleUrls: ['./../venueCreate.component.css']
})
export class VenueHoursComponent extends BaseComponent implements OnInit,OnChanges {
    @Input() Venue: AccountCreateModel;
    @Output() onSaveVenue:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();
    @Output() onError:EventEmitter<string> = new EventEmitter<string>();
    @Output() onVenueChanged:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();

    OfficeHours:FrontWorkingTimeModel[] = [];
    OfficeHoursSelectedDate = false;

    OperatingHours:FrontWorkingTimeModel[] = [];
    OperatingHoursSelectedDate = false;

    ngOnInit(): void 
    {
        this.Init();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if(changes.Venue && changes.Venue.currentValue)
            this.Venue = changes.Venue.currentValue;

        this.Init();
    }

    Init()
    {
        this.OfficeHours = (this.Venue && this.Venue.office_hours)?
            this.main.accService.GetFrontWorkingTimeFromTimeModel(this.Venue.office_hours):this.main.typeService.GetAllDays();

        this.OperatingHours = (this.Venue && this.Venue.operating_hours)?
            this.main.accService.GetFrontWorkingTimeFromTimeModel(this.Venue.operating_hours):this.main.typeService.GetAllDays();
        
        this.IsNeedToShowSelectDayWrapper();
    }

    IsNeedToShowSelectDayWrapper()
    {
        this.OperatingHoursSelectedDate = this.OperatingHours.filter(obj => obj.checked == true).length > 0;
        this.OfficeHoursSelectedDate = this.OfficeHours.filter(obj => obj.checked == true).length > 0;
    }

    GetFromTimeMask(item:FrontWorkingTimeModel){
        let mask = /\d/;
        if(item.start_work && item.start_work.length > 0)
        {
            if(+(item.start_work[0]) > 1) mask = /[0-3]/ ;
        }
        return {
            mask: [/[0-2]/, mask, ':', /[0-5]/, /\d/],
            keepCharPositions: true
        };
    } 
    GetToTimeMask(item:FrontWorkingTimeModel){
        return {
            mask: this.main.typeService.GetEndTimeMask(item.start_work,item.finish_work),
            keepCharPositions: true
        };
    }

    SaveVenue()
    {
        this.GetHoursToVenueModel();
        $('html,body').animate({
            scrollTop: 0
        }, 0);
        this.onSaveVenue.emit(this.Venue);
    }

    GetHoursToVenueModel()
    {
        this.Venue.office_hours = this.main.accService.GetWorkingTimeFromFront(this.OfficeHours);
        this.Venue.operating_hours = this.main.accService.GetWorkingTimeFromFront(this.OperatingHours);
    }

    OfficeHoursCheckChange(index, $event)
    {
        this.OfficeHours[index].checked = $event;

        this.IsNeedToShowSelectDayWrapper();
        this.OnVenueModelChange();
    }

    OperatingHoursCheckChange(index, $event)
    {
        this.OperatingHours[index].checked = $event;

        this.IsNeedToShowSelectDayWrapper();
        this.OnVenueModelChange();
    }

    OfficeHoursBeginChange(index,$event)
    {
        this.OfficeHours[index].start_work = $event;
        this.OnVenueModelChange();
    }

    OfficeHoursEndChange(index,$event)
    {
        this.OfficeHours[index].finish_work = $event;
        this.OnVenueModelChange();
    }

    OperHoursBeginChange(index,$event)
    {
        this.OperatingHours[index].start_work = $event;
        this.OnVenueModelChange();
    }

    OperHoursEndChange(index,$event)
    {
        this.OperatingHours[index].finish_work = $event;
        this.OnVenueModelChange();
    }

    OnVenueModelChange()
    {
        this.GetHoursToVenueModel();
        this.onVenueChanged.emit(this.Venue);
    }

}