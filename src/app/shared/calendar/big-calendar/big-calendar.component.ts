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
import { NgForm } from '@angular/forms';
import { CurrencyIcons, Currency } from '../../../core/models/preferences.model';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { EventGetModel } from '../../../core/models/eventGet.model';


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
  currency?: string
}

export interface FormValsInterface {
  is_available: boolean;
  date_range: boolean;
  from: Date;
  to?:Date;
  price_for_daytime?: number;
  price_for_nighttime?: number;
}

@Component({
  selector: 'app-big-calendar',
  templateUrl: './big-calendar.component.html',
  styleUrls: ['./big-calendar.component.css']//,
  //encapsulation: ViewEncapsulation.None
})
export class BigCalendarComponent implements OnInit, OnChanges {

  currentDate = moment();

  MonthPrev = moment();
  MonthNext = moment();
  dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  weeks: CalendarDate[][] = [];
  sortedDates: CalendarDate[] = [];
  eventsThisMonth :EventGetModel[] = [];
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
  @Input() CurrencyIcon:string;
  @Input() isPreview:boolean;
  @Output() ChangeMonth: any = new EventEmitter<any>();

  @ViewChild('SaveForm') form: NgForm;

  FormVals: FormValsInterface = {
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
    this.GetEventsInfo();
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
    if(moment().endOf('day').valueOf()<= day.mDate.endOf('day').valueOf()){
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


  }





  StartRangeEvent(event,day){
    if(moment().endOf('day').valueOf()<= day.mDate.endOf('day').valueOf()){
      this.FlagForRangePick = true;
      this.FromElement.event = event;
      this.FromElement.CalendarDate = day;
      this.FromElement.event.target.classList.add("mouseSelectDay");
    }
  }
  EndRangeEvent(event,day){
    if(moment().endOf('day').valueOf()<= day.mDate.endOf('day').valueOf()){
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
  }

  SetDefaultFormVals(){
    this.FormVals.date_range = this.FormVals.from.toISOString() != this.FormVals.to.toISOString();
    if(!this.FormVals.date_range)
    {
      const disabled = this.selectedDates.find(obj => this.main.typeService.GetDateStringFormat(obj.mDate.toDate()) == this.main.typeService.GetDateStringFormat(this.FormVals.from));

      this.FormVals.is_available = !(Boolean(disabled));

      if(this.FormVals.is_available)
      {


// <<<<<<<<<<<<<<<<<<< -------------------------- FIX HERE obj.mDate.toDate() == this.FormVals.from.toISOString()  ------------------------------ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


        const changed = this.changedPrice.find(obj => obj.mDate.format().split('T')[0] == this.FormVals.from.toISOString().split('T')[0]);
        this.FormVals.price_for_daytime = (changed && changed.dayPrice)? changed.dayPrice : (this.allDaysPriceDay ? this.allDaysPriceDay : 0);
        this.FormVals.price_for_nighttime = (changed && changed.nightPrice)? changed.nightPrice : (this.allDaysPriceNight ? this.allDaysPriceNight : 0);
      }
      else {
        this.FormVals.price_for_daytime = 0;
        this.FormVals.price_for_nighttime = 0;
      }
    }
    else{
      this.FormVals.is_available = true;
      this.FormVals.price_for_daytime = 0;
      this.FormVals.price_for_nighttime = 0;
    }
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
      return moment.utc(date).isSame(selectedDate.mDate, 'day');
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
    // const index = this.changedPrice.findIndex(changed => date.toDate().toDateString() == changed.mDate.toDate().toDateString());
    for(let changed of this.changedPrice)
    {
      // if(moment(date).isSame(changed.mDate, 'day'))console.log(`+++++ `,date, moment(date), changed.mDate,  );
      if(moment(date).isSame(changed.mDate, 'day') && (changed.nightPrice || changed.dayPrice))
      {
        return true;
      }
    }
    return false;
    // return _.findIndex(this.changedPrice, (changed) => date.format("MM-DD-YYYY") == changed.mDate.format("MM-DD-YYYY")) != -1;
    //return date.isSame(changed.mDate,'day');
      // return moment(date).isSame(changed.mDate, 'day');
  }

  isCurrency(date: moment.Moment): string{
    const index =  _.findIndex(this.changedPrice, (changed) => {
      return moment(date).isSame(changed.mDate, 'day');
    });
    return (index < 0)? this.CurrencyIcon : CurrencyIcons[this.changedPrice[index].currency];
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
    this.ChangeMonth.emit(this.currentDate.toDate());
    this.generateCalendar();
    // this.GetEventsInfo();
  }

  nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.ChangeMonth.emit(this.currentDate.toDate());
    this.generateCalendar();
    // this.GetEventsInfo();
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
          (res:EventGetModel) =>{
            //this.InitEvent(res);
            const index = this.eventsThisMonth.findIndex(obj => obj.id == res.id);
            if(index === -1)
            {
              this.eventsThisMonth.push(res);
              this.GetImage(res.image_id);
            }

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
                      const url = this.main.imagesService.GetImagePreview(imageId,{width:270,height:175});
                      const model = {
                        base64: url,
                        event_id:res.event_id
                      };
                      if(this.Images.findIndex(obj => obj.event_id == model.event_id && obj.base64 == model.base64) < 0)
                      {
                        this.Images.push(model);
                      }
                      // this.Images.push((res && res.base64) ? res : {base64:BaseImages.Drake,event_id:res.event_id});
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
    console.log(weeks);
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
                nightPrice:this.isPriceNight(d,this.isChangedPrice(d)),
                currency: this.isCurrency(d)
              };
            });
  }

  SaveCheckedDate()
  {
    if(this.FormVals.from > this.FormVals.to)
    {
      const from = new Date(this.FormVals.to);
      this.FormVals.to = new Date(this.FormVals.from);
      this.FormVals.from = from;
    }
    this.onSelectDate.emit({form:this.FormVals, date: this.currentDate.toDate()});
    this.CloseModalPrice(null);
  }

  MaskPrice()
    {
      let mask = createNumberMask(
        {
            prefix: '',
            suffix: '',
            allowDecimal: true,
            includeThousandsSeparator: false
        }
      );
      return {
      mask: mask,
      keepCharPositions: true,
      guide:false
      };
    }

}
