import { Component, OnInit, ViewChild, Input, SimpleChanges, Output, EventEmitter, NgZone, ChangeDetectorRef } from '@angular/core';
import { TinyCalendarComponent, CalendarDate } from './../../../shared/calendar/tiny-calendar/tiny-calendar.component';
import * as moment from 'moment';
import { AccountCreateModel } from '../../../core/models/accountCreate.model';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { TranslateService } from '../../../../../node_modules/@ngx-translate/core';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-artist-calendar',
  templateUrl: './artist-calendar.component.html',
  styleUrls: ['./artist-calendar.component.css']
})
export class ArtistCalendarComponent extends BaseComponent implements OnInit {

  DisabledDates: CalendarDate[] = [];
  @Input('ArtistId') artistId:number;



  // DisabledDates: CalendarDate[] = [
  //   {mDate: moment('2018-06-13')},
  //   {mDate: moment("14-06-2018", "DD-MM-YYYY")},
  //   {mDate: moment('2018-06-24')}
  // ];
  EventDates: CalendarDate[] = [];

@Input('Artist') artist:AccountCreateModel;
@Output('onSave') onSave = new EventEmitter<AccountCreateModel>();
@Output('openNextPage') openNextPage = new EventEmitter();

@ViewChild('calendar') calendar:TinyCalendarComponent;

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

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.artist){
        this.EventDates = [];
        this.DisabledDates = [];
      for(let date of this.artist.events_dates){
          if(date.date)
                this.EventDates.push({
                mDate: moment(date.date.split("T")[0]),
                eventId: date.id

                });
      }
      for(let date of this.artist.disable_dates){
          if(date.date)
                this.DisabledDates.push({
                mDate: moment(date.date.split("T")[0])
                });
      }
    }

  }


  SendDisableDates(){
    //this.DisabledDates[0].mDate.format("YYYY-MM-DD");
    this.artist.disable_dates = [];
    for(let date of this.DisabledDates){
        this.artist.disable_dates.push({
            date: date.mDate.format("YYYY-MM-DD")
        });
    }



    // this.onSave.emit(this.artist);
    this.main.accService.UpdateMyAccount(this.artistId,this.artist).subscribe(
        (res)=>{
        }
        ,(err)=>{
        }
    )




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
          this.SendDisableDates();

      }
  }

  OpenNextPage(){
    this.openNextPage.emit();
  }

}

