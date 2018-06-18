import { Component, OnInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import { TinyCalendarComponent, CalendarDate } from '../tiny-calendar/tiny-calendar.component';
import * as moment from 'moment';
import { AccountCreateModel } from '../../../core/models/accountCreate.model';
@Component({
  selector: 'app-artist-calendar',
  templateUrl: './artist-calendar.component.html',
  styleUrls: ['./artist-calendar.component.css']
})
export class ArtistCalendarComponent implements OnInit {

  DisabledDates: CalendarDate[] = [];




  // DisabledDates: CalendarDate[] = [
  //   {mDate: moment('2018-06-13')},
  //   {mDate: moment("14-06-2018", "DD-MM-YYYY")},
  //   {mDate: moment('2018-06-24')}
  // ];
  EventDates: CalendarDate[] = [];

@Input('Artist') artist:AccountCreateModel;

@ViewChild('calendar') calendar:TinyCalendarComponent;

  constructor() { }

  ngOnInit() {
    console.log(this.artist);
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.artist);
    if(this.artist){
      for(let date of this.artist.events_dates){
        this.EventDates.push({
          mDate: moment(date.date.split("T")[0]),
          eventId: date.event_id 

        });
      }
    }
  }

  DisableDate(event){
      if(!event.event){ 
          if(!event.selected){
              this.DisabledDates.push({
                  mDate: event.mDate
              });
          }
          else{
              let BreakException = {};
              try {
                  this.DisabledDates.forEach(function(e,index,arr){
                      if(e.mDate.date() == event.mDate.date()){
                          arr.splice(index,1);
                          throw BreakException;
                      }
                  });
              } catch (e) {
                  if (e !== BreakException) throw e;
              }
          }
      }
  }
}

