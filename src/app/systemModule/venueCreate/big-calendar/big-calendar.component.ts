import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, NgZone, ChangeDetectorRef, ViewEncapsulation, ViewChild } from '@angular/core';
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
import { NgForm } from '../../../../../node_modules/@angular/forms';


interface EventMouseInfo {
  event?: any;
  CalendarDate?: CalendarDate;
  
}
export interface CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
  event?:boolean;
  eventId?:any;
  changed?:boolean;
  dayPrice?:number;
  nightPrice?:number;
}

@Component({
  selector: 'app-big-calendar',
  templateUrl: './big-calendar.component.html',
  styleUrls: ['./big-calendar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BigCalendarComponent implements OnInit, OnChanges {

  currentDate = moment();

  MonthPrev = moment();
  MonthNext = moment();
  dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  weeks: CalendarDate[][] = [];
  sortedDates: CalendarDate[] = [];
  eventsThisMonth :AccountGetModel[] = [];
  Images:Base64ImageModel[] = [];
  FlagForRangePick = false;
  FromElement:EventMouseInfo = {};
  ToElement:EventMouseInfo = {};
  newChangedDays:CalendarDate[] = [];

  @Input() allDaysPriceDay: number;
  @Input() allDaysPriceNight: number;
  @Input() selectedDates: CalendarDate[] = [];
  @Input() eventDates: CalendarDate[] = [];
  @Input() changedPrice: any[] = [];
  @Output() onSelectDate = new EventEmitter<any>();

  @ViewChild('SaveForm') form: NgForm;

  FormVals = {
    is_available: true,
    date_range: true,
    from: null,
    to:null,
    price_for_daytime: 0,
    price_for_nighttime: 0
  };

  constructor(
    protected main           : MainService,
    protected _sanitizer     : DomSanitizer,
    protected router         : Router,
    protected mapsAPILoader  : MapsAPILoader,
    protected ngZone         : NgZone,
    protected activatedRoute : ActivatedRoute,
    protected cdRef          : ChangeDetectorRef
) {
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
    }
    this.generateCalendar();
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

  MoveForRange(event,day){
    let selectDayClass = "mouseSelectDay";

    if(this.FlagForRangePick){
      this.ToElement.event = event;
      this.ToElement.CalendarDate = day;
      let fromDate = this.FromElement.CalendarDate.mDate; 
      let toDate = this.ToElement.CalendarDate.mDate;
      let indexStartElement = [].indexOf.call(
        this.FromElement.event.target.offsetParent.children,(this.FromElement.event ? this.FromElement.event.target : this.FromElement.event.srcElement)
      );
      let indexHoverElement = [].indexOf.call(event.target.offsetParent.children, (event ? event.target : event.srcElement));



      for(var i = 0; i < event.target.offsetParent.children.length; i++){
        
        if(event.target.offsetParent.children[i].classList.contains(selectDayClass)){
          event.target.offsetParent.children[i].classList.remove(selectDayClass);
        }
      }
      this.FromElement.event.target.classList.add(selectDayClass);
    
      if(parseInt(fromDate.format("YYYYMMDD")) < parseInt(toDate.format("YYYYMMDD"))){
        for(var i = 0; i <= event.target.offsetParent.children.length; i++){
          if( indexStartElement < indexHoverElement && (i - 1) < indexHoverElement && (i + 1) > indexStartElement){
            event.target.offsetParent.children[i].classList.add(selectDayClass);
          }
        }
      }
      else{
        for(var i = 0; i <= event.target.offsetParent.children.length; i++){
          if( indexStartElement > indexHoverElement && (i + 1) > indexHoverElement && (i - 1) < indexStartElement){
            event.target.offsetParent.children[i].classList.add(selectDayClass);
          }
        }
      }
    }
    



  }





  StartRangeEvent(event,day){
      this.FlagForRangePick = true;
      this.FromElement.event = event;
      this.FromElement.CalendarDate = day;
      this.FromElement.event.target.classList.add("mouseSelectDay");
  }
  EndRangeEvent(event,day){
    this.FlagForRangePick = false;
    this.ToElement.event = event;
    this.ToElement.CalendarDate = day;
    if(parseInt(this.FromElement.CalendarDate.mDate.format("YYYYMMDD")) <= parseInt(this.ToElement.CalendarDate.mDate.format("YYYYMMDD"))){
      for(let week of this.weeks){
        for(let day of week){
          if(parseInt(day.mDate.format("YYYYMMDD")) >= parseInt(this.FromElement.CalendarDate.mDate.format("YYYYMMDD")) 
          && parseInt(day.mDate.format("YYYYMMDD")) <= parseInt(this.ToElement.CalendarDate.mDate.format("YYYYMMDD"))){
            this.newChangedDays.push(day);
          }
        }
      }
    }
    else{
      for(let week of this.weeks){
        for(let day of week){
          if(parseInt(day.mDate.format("YYYYMMDD")) <= parseInt(this.FromElement.CalendarDate.mDate.format("YYYYMMDD")) 
          && parseInt(day.mDate.format("YYYYMMDD")) >= parseInt(this.ToElement.CalendarDate.mDate.format("YYYYMMDD"))){
            this.newChangedDays.push(day);
          }
        }
      }
    }

    if(this.FromElement.CalendarDate.mDate.toDate() > this.ToElement.CalendarDate.mDate.toDate())
    {
      this.FormVals.from = this.ToElement.CalendarDate.mDate.toDate();
      this.FormVals.to = this.FromElement.CalendarDate.mDate.toDate();
    }
    else{
      this.FormVals.from = this.FromElement.CalendarDate.mDate.toDate();
      this.FormVals.to = this.ToElement.CalendarDate.mDate.toDate();
    }

    this.SetDefaultFormVals();
    
    event.target.offsetParent.classList.add("set-date-popup");
  }

  SetDefaultFormVals(){
    this.FormVals.date_range = true;
    this.FormVals.is_available = true;
    this.FormVals.price_for_daytime = 0;
    this.FormVals.price_for_nighttime = 0;
  }



  CloseModalPrice(event){
    if(document.querySelector(".jsDays-wrapp").classList.contains("set-date-popup")){
      document.querySelector(".jsDays-wrapp").classList.remove("set-date-popup");
    }
  
    for(var i = 0; i < document.querySelector(".jsDays-wrapp").children.length; i++){
      if(document.querySelector(".jsDays-wrapp").children[i].classList.contains("mouseSelectDay")){
        document.querySelector(".jsDays-wrapp").children[i].classList.remove("mouseSelectDay");
      }
    }
    this.newChangedDays = [];
  }

  isSelected(date: moment.Moment): boolean {
    return _.findIndex(this.selectedDates, (selectedDate) => {
      return moment(date).isSame(selectedDate.mDate, 'day');
    }) > -1;
  }

  isPriceMorning(date: moment.Moment,changed:boolean) {
    if(changed){
      for(let changedPriceDay of this.changedPrice){
        if(moment(date).isSame(changedPriceDay.mDate, 'day')){
          return changedPriceDay.dayPrice;
        }
      }
    }
  }
  isPriceNight(date: moment.Moment,changed:boolean) {
    if(changed){
      for(let changedPriceNight of this.changedPrice){
        if(moment(date).isSame(changedPriceNight.mDate, 'day')){
          return changedPriceNight.nightPrice;
        }
      }
    }
  }



  isChangedPrice(date: moment.Moment): boolean {
    return _.findIndex(this.changedPrice, (changed) => {
      return moment(date).isSame(changed.mDate, 'day');
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
    this.onSelectDate.emit(date);
    this.generateCalendar();
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
            // console.log(err);
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
                eventId: this.isEventId(d,this.isEvent(d)),
                changed:this.isChangedPrice(d),
                dayPrice:this.isPriceMorning(d,this.isChangedPrice(d)),
                nightPrice:this.isPriceNight(d,this.isChangedPrice(d))
              };
            });
  }

  SaveCheckedDate()
  {
    this.onSelectDate.emit(this.FormVals);
    this.CloseModalPrice(null);
  }

  MaskPrice()
    {
        return {
            // mask: ['+',/[1-9]/,' (', /[1-9]/, /\d/, /\d/, ') ',/\d/, /\d/, /\d/, '-', /\d/, /\d/,'-', /\d/, /\d/],
            mask: [/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/],
            keepCharPositions: true,
            guide:false
        };
    }

}
