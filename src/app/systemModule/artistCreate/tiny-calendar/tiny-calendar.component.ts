import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, NgZone, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';

import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { Base64ImageModel } from '../../../core/models/base64image.model';
import { MainService } from '../../../core/services/main.service';
import { BaseImages } from '../../../core/base/base.enum';
import { TranslateService } from '../../../../../node_modules/@ngx-translate/core';
import { SettingsService } from '../../../core/services/settings.service';


export interface CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
  event?:boolean;
  eventId?:any;
}

@Component({
  selector: 'app-tiny-calendar',
  templateUrl: './tiny-calendar.component.html',
  styleUrls: ['./tiny-calendar.component.css']
})
export class TinyCalendarComponent extends BaseComponent implements OnInit, OnChanges {

  currentDate = moment();

  MonthPrev = moment();
  MonthNext = moment();
  dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  weeks: CalendarDate[][] = [];
  sortedDates: CalendarDate[] = [];
  eventsThisMonth :AccountGetModel[] = [];
  Images:Base64ImageModel[] = [];

  @Input() selectedDates: CalendarDate[] = [];
  @Input() eventDates: CalendarDate[] = [];
  @Output() onSelectDate = new EventEmitter<CalendarDate>();

  constructor(
    protected main           : MainService,
    protected _sanitizer     : DomSanitizer,
    protected router         : Router,
    protected mapsAPILoader  : MapsAPILoader,
    protected ngZone         : NgZone,
    protected activatedRoute : ActivatedRoute,
    protected cdRef          : ChangeDetectorRef,
    protected translate      :TranslateService,
    protected settings       :SettingsService
) {
super(main,_sanitizer,router,mapsAPILoader,ngZone,activatedRoute,translate,settings);
}

  ngOnInit(): void {
    this.generateCalendar();
    this.GetEventsInfo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedDates &&
        changes.selectedDates.currentValue &&
        changes.selectedDates.currentValue.length  > 1) {
          this.sortedDates = _.sortBy(changes.selectedDates.currentValue, (m: CalendarDate) => m.mDate.valueOf());
          //this.generateCalendar();
        }
  }
  GetEventsInfo(){
    this.Images = [];
    this.eventsThisMonth = [];
    for(let week of this.weeks){
      for(let day of week){
        if(day.event){
          this.GetEventInfo(day.eventId);
        }
      }
    }
  }

  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  isSelected(date: moment.Moment): boolean {
    return _.findIndex(this.selectedDates, (selectedDate) => {
      return moment(date).isSame(selectedDate.mDate, 'day');
    }) > -1;
  }
  
  isEvent(date: moment.Moment): boolean {
    return _.findIndex(this.eventDates, (eventDate) => {
      return moment(date).isSame(eventDate.mDate, 'day');
    }) > -1;
  }

  isEventId(date: moment.Moment,hasEvent:boolean) {
    if(hasEvent){
      for(let eventDate of this.eventDates){
        if(moment(date).isSame(eventDate.mDate, 'day')){
          return eventDate.eventId;
        }
      }
    }
  }
  

  isSelectedMonth(date: moment.Moment): boolean {
    return moment(date).isSame(this.currentDate, 'month');
  }

  selectDate(date: CalendarDate): void {
    
    if(moment().endOf('day').valueOf()<= date.mDate.endOf('day').valueOf()){
      this.onSelectDate.emit(date);
      this.generateCalendar();
    }
  }

  GetPrevMonth(): void {
    this.MonthPrev = moment(this.currentDate).subtract(1, 'months');
  }
  GetNextMonth(): void {
    this.MonthNext = moment(this.currentDate).add(1, 'months');
  }


  prevMonth(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    this.generateCalendar();
    this.GetEventsInfo();
  }

  nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.generateCalendar();
    this.GetEventsInfo();
  }

  firstMonth(): void {
    this.currentDate = moment(this.currentDate).startOf('year');
    this.generateCalendar();
  }

  lastMonth(): void {
    this.currentDate = moment(this.currentDate).endOf('year');
    this.generateCalendar();
  }


  GetEventInfo(id:number)
    {
        this.main.eventService.GetEventById(id).subscribe(
          (res:any) =>{
            //this.InitEvent(res);
            this.eventsThisMonth.push(res);
            this.GetImage(res.image_id);
          },
          (err)=>{
          }
        );
    }
    GetImage(imageId)
    {
        if(imageId)
        {
            this.main.imagesService.GetImageById(imageId)
              .subscribe(
                  (res:Base64ImageModel) => {
                      this.Images.push((res && res.base64) ? res : {base64:BaseImages.Drake,event_id:res.event_id});
                }
              );
        }
    }

 

  //генератор сетки
  generateCalendar(): void {
    
    const dates = this.fillDates(this.currentDate);
    const weeks: CalendarDate[][] = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    this.weeks = weeks;
    this.GetPrevMonth();
    this.GetNextMonth();
   

  }

  fillDates(currentMoment: moment.Moment): CalendarDate[] {  
    const firstOfMonth = moment(currentMoment).startOf('month').day();
    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
    const start = firstDayOfGrid.date();
    return _.range(start, start + 42)
            .map((date: number): CalendarDate => {
              const d = moment(firstDayOfGrid).date(date);
             
              return {
                today: this.isToday(d),
                selected: this.isSelected(d),
                mDate: d,
                event:this.isEvent(d),
                eventId: this.isEventId(d,this.isEvent(d))
              };
            });
  }

}
