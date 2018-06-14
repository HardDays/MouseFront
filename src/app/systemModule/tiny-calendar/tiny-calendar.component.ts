import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';

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
export class TinyCalendarComponent implements OnInit, OnChanges {

  currentDate = moment();

  MonthPrev = moment();
  MonthNext = moment();
  dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  weeks: CalendarDate[][] = [];
  sortedDates: CalendarDate[] = [];
  


  @Input() selectedDates: CalendarDate[] = [];
  @Input() eventDates: CalendarDate[] = [];
  @Output() onSelectDate = new EventEmitter<CalendarDate>();

  constructor() {}

  ngOnInit(): void {
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedDates &&
        changes.selectedDates.currentValue &&
        changes.selectedDates.currentValue.length  > 1) {
          this.sortedDates = _.sortBy(changes.selectedDates.currentValue, (m: CalendarDate) => m.mDate.valueOf());
          this.generateCalendar();
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

  isEventId(date: moment.Moment) {
    
    let index = 0;

    
    for( let eventDate of this.eventDates){

        if(date.date() ==  eventDate.mDate.date()){
          
          return eventDate.eventId

        }
        else{
          return null;
        }
    }
    

    // console.log(
    //   _.findIndex(this.eventDates, (eventDate) => {
    //     return moment(date).isSame(eventDate.mDate, 'day');
     
      
    //   })


    // );
    // return _.findIndex(this.eventDates, (eventDate) => {
      
     
      
    // })
    // _.findIndex(this.eventDates, (eventDate) => {
    //   if(moment(date).isSame(eventDate.mDate, 'day')){
    //     console.log(1);
    //     return eventDate.eventId;
    //   }
    //   else{
    
    //     return;
    //   }
    // });
    
    // for( let eventDate of this.eventDates){
 
    //   if(moment(date).isSame(eventDate.mDate, 'day')){
        
    //     return eventDate.eventId;
    //   }
    //   else{
    //     return 
    //   }
    // }
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
  }

  nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.generateCalendar();
  }

  firstMonth(): void {
    this.currentDate = moment(this.currentDate).startOf('year');
    this.generateCalendar();
  }

  lastMonth(): void {
    this.currentDate = moment(this.currentDate).endOf('year');
    this.generateCalendar();
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
                eventId: this.isEventId(d)
              };
            });
  }

}
