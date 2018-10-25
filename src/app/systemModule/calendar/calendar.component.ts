import { BaseComponent } from './../../core/base/base.component';
import { Component, OnInit } from '@angular/core';
import { CalendarDate } from './tiny-calendar/tiny-calendar.component';
import * as moment from 'moment';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { Currency, CurrencyIcons } from '../../core/models/preferences.model';
import { VenueDatesModel } from '../../core/models/venueDatesModel';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { AccountCreateModel } from '../../core/models/accountCreate.model';

interface Events {
  id: number;
  name: string;
  date: string;
  image: string;
  image_id: number;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent extends BaseComponent implements OnInit {

    DisabledDates: CalendarDate[] = [];
    EventDates: CalendarDate[] = [];

    Venue;
    changedPrice: CalendarDate[] = [];
    disabledDays: CalendarDate[] = [];
    eventsDates:CalendarDate[] = [];
    type_min_time_to_book:string = '';
    MyCurrency:string = Currency.USD;
    CurIcons = CurrencyIcons;

    Events: Events[] = [];

    ngOnInit() {
      console.log(this.CurrentAccount);
      if(this.CurrentAccount.account_type === 'artist'){
        console.log(`Artist`);;
        this.GetAccount(this.CurrentAccount.id);
      }
      else if(this.CurrentAccount.account_type === 'venue'){
        console.log(`Venue`);
        this.GetAccount(this.CurrentAccount.id);
      }
    }

    GetAccount(id:number){
      this.WaitBeforeLoading(
            () => this.main.accService.GetAccountById(id),
            (res:AccountGetModel) => {
              if(this.CurrentAccount.account_type === 'artist')
                this.GetArtistCalendar(res);
              else if(this.CurrentAccount.account_type === 'venue') {
                this.Venue = res;
                this.ChangeDates(res.id);
                this.MyCurrency = this.main.settings.GetCurrency();
              }
            }, (err)=>{
              console.log(`err`,err);
            }
          );
    }

    GetArtistCalendar(acc:AccountGetModel){
      console.log(`acc`,acc);
      this.EventDates = [];
      this.DisabledDates = [];
      for(let date of acc.events_dates){
          if(date.date)
                this.EventDates.push({
                mDate: moment(date.date.split("T")[0]),
                eventId: date.event_id
                });
      }
      for(let date of acc.disable_dates){
          if(date.date)
                this.DisabledDates.push({
                mDate: moment(date.date.split("T")[0])
                });
      }
      this.GetEvents();
    }

    ChangeDates(id:number, NewDate?:Date)
    {
        let params = {
            current_date:null
        };

        let date = moment(NewDate);
        date=date.date(1);

        this.changedPrice = [];
        this.disabledDays = [];
        this.eventsDates = [];

        if(id){
            let date_iter = moment(date.toISOString()).month(date.month() - 1);
            date = date.month(date.month() + 1);
            let index = 1;
            while(date_iter.toDate().getTime() <= date.toDate().getTime())
            {
                params.current_date = date_iter.toISOString();

                this.main.accService.GetVenueDates(id, params)
                    .subscribe(
                        (res) => {

                            this.SetChangedPrice(res.dates);
                            this.SetEventsDates(res.event_dates);
                        }
                    );

                date_iter = date_iter.month(date_iter.month()+1);
            }
        }
    }

    SetChangedPrice(input:any[])
    {
        let arr = [];
        for(const i in input)
        {
            const item:VenueDatesModel = input[i];
            const date = {
                // mDate: moment(this.main.typeService.GetDateStringFormat(new Date(item.date))),
                mDate: moment(this.main.typeService.DateToUTCDateISOString(item.date)),
                selected: !item.is_available,
                dayPrice: item.price_for_daytime,
                nightPrice: item.price_for_nighttime,
                changed:true,
                currency: item.currency? item.currency : this.MyCurrency
            };
            arr.push(date);
        }
        this.changedPrice = this.changedPrice.concat(arr.filter(obj => !obj.selected));
        this.disabledDays = this.disabledDays.concat(arr.filter(obj => obj.selected));
    }

    SetEventsDates(input:any[])
    {
        let arr = [];
        for(const i in input)
        {
            if(input[i].id && input[i].exact_date_from)
            {
                arr.push({
                    mDate: moment(this.main.typeService.DateToUTCDateISOString(input[i].exact_date_from)),
                    event: true,
                    eventId: input[i].id
                });
            }
        }
        this.eventsDates = this.eventsDates.concat(arr);
        this.GetEvents();
    }

    GetEvents(){
      console.log(`GetEvents`);
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
