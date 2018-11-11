import { BaseComponent } from './../../core/base/base.component';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { CalendarDate } from './tiny-calendar/tiny-calendar.component';
import * as moment from 'moment';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { Currency, CurrencyIcons } from '../../core/models/preferences.model';
import { VenueDatesModel } from '../../core/models/venueDatesModel';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { AccountCreateModel } from '../../core/models/accountCreate.model';
import { BaseImages } from '../../core/base/base.enum';
import { FormGroup, FormControl, Validators } from '@angular/forms';

interface Events {
  id: number;
  name: string;
  date: string;
  image: string;
  image_id: number;
  exact_date_from: string;
  address: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent extends BaseComponent implements OnInit {

    DisabledDates: CalendarDate[] = [];
    EventDates: CalendarDate[] = [];

    Venue: AccountGetModel = new AccountGetModel();
    Artist;
    changedPrice: CalendarDate[] = [];
    disabledDays: CalendarDate[] = [];
    eventsDates:CalendarDate[] = [];
    type_min_time_to_book:string = '';
    MyCurrency:string = Currency.USD;
    CurIcons = CurrencyIcons;

    Events: Events[] = [];

    dateForm : FormGroup = new FormGroup({
        "minimum_notice": new FormControl("",[Validators.pattern("[0-9]+"),
                                Validators.min(0),Validators.max(999)]),
        "is_flexible": new FormControl("",[]),
        "price_for_daytime": new FormControl("",[Validators.required,
                                Validators.min(0),Validators.max(1000000)]),
        "price_for_nighttime": new FormControl("",[Validators.required,,
                                Validators.min(0),Validators.max(1000000)]),
        "performance_time_from": new FormControl("",[]),
        "performance_time_to": new FormControl("",[]),
        "minimum_notice_text": new FormControl("",[])
    });

    ngOnInit() {
      this.Init();
      this.main.CurrentAccountChange.
        subscribe((res)=>{
          this.Init();
        })
    }

    Init(){
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
              console.log(`res =`, res);
              if(this.CurrentAccount.account_type === 'artist'){
                this.Artist = res;
                this.GetArtistCalendar(this.Artist);
              }
              else if(this.CurrentAccount.account_type === 'venue') {
                this.Venue = res;
                this.ChangeDates(res.id);
                this.MyCurrency = this.main.settings.GetCurrency();
              }
              this.GetEvents(res);
            }, (err)=>{
              console.log(`err`,err);
            }
          );
    }

    GetEvents(acc){
      this.Events = [];
       for(let date of acc.events_dates){
        if(date['id']){
            this.Events.push(date);
          }
       }
       for(let item of this.Events){
         if(item.image_id){
          item.image = this.main.imagesService.GetImagePreview(item.image_id, {width: 275, height: 172})
         }
         else {
           item.image = BaseImages.NoneFolowerImage;
         }
       }
       console.log(`Events`,this.Events);
    }

    GetArtistCalendar(acc:AccountGetModel){

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
      console.log(`DisDate = `, this.DisabledDates);

    }

  SendDisableDates(){
    //this.DisabledDates[0].mDate.format("YYYY-MM-DD");
    this.Artist.disable_dates = [];
    for(let date of this.DisabledDates){
        this.Artist.disable_dates.push({
            date: date.mDate.format("YYYY-MM-DD")
        });
    }

    // this.onSave.emit(this.artist);
    this.main.accService.UpdateMyAccount(this.Artist.id,this.Artist).subscribe(
        (res)=>{
            // console.log(res);
        }
        ,(err)=>{
            // console.log(err);
        }
    )

  }

    DisableDateArtist(event){
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


    SaveDates($event)
    {
        let arr:VenueDatesModel[] = [];
        const form = $event.form;
        let curr_date = moment(form.from);
        let end_date = moment(form.to);
        arr.push(this.CalendarFormToVenueDate(curr_date.toDate(),form));
        if(form.date_range){
            curr_date.date(curr_date.date() +1);
            while(curr_date <= end_date){

                arr.push(this.CalendarFormToVenueDate(curr_date.toDate(),form));
                curr_date.date(curr_date.date() +1);
            }
        }
        this.main.accService.SaveVenueDatesAsArray(this.Venue.id, {dates: arr})
            .subscribe(
                (res: any) => {
                    this.ChangeDates($event.date);
                }
            );
    }

    CalendarFormToVenueDate(date:Date, data:any)
    {
        let model = new VenueDatesModel();
        model.date = this.main.typeService.GetDateStringFormat(date);
        model.is_available = data.is_available;
        if(model.is_available)
        {
            if(data.price_for_daytime !== null)
                model.price_for_daytime = parseFloat(data.price_for_daytime);

            if(data.price_for_nighttime !== null)
                model.price_for_nighttime = parseFloat(data.price_for_nighttime);


            if(Number.isNaN(model.price_for_daytime) || Number.isNaN(model.price_for_nighttime))
            {
                const index = this.changedPrice.findIndex((val)=> date.toDateString() == val.mDate.toDate().toDateString());
                if(index != -1)
                {
                    if(Number.isNaN(model.price_for_daytime) && !Number.isNaN(this.changedPrice[index].dayPrice))
                        model.price_for_daytime = this.changedPrice[index].dayPrice;

                    if(Number.isNaN(model.price_for_nighttime) && !Number.isNaN(this.changedPrice[index].nightPrice))
                        model.price_for_nighttime = this.changedPrice[index].nightPrice;
                }
            }

            model.currency = this.MyCurrency;
        }
        return model;
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

                this.main.accService.GetVenueDates(this.Venue.id, params)
                    .subscribe(
                        (res) => {
                            this.SetChangedPrice(res.dates);
                            this.SetEventsDates(res.events_dates);
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

    SaveEventLeftData() {
      delete this.Venue["dates"];
      delete this.Venue["events_dates"];

      this.main.accService.UpdateMyAccount(this.Venue.id,this.Venue).
      subscribe(
      (res) => {
        // this.DisplayVenueParams(res);
        // this.errorCmp.OpenWindow(BaseMessages.Success);
        // this.main.GetMyAccounts(
        //   () => {

        //     this.main.CurrentAccountChange.next(res);
        //   }
        // );
        // setTimeout(
        //   () => {
        //     //this.main.CurrentAccountChange.next(res);
        //     this.errorCmp.CloseWindow();
        //     this.router.navigate(["/system","profile",this.VenueId]);
        //     scrollTo(0,0);
        //   },
        //   2000
        // );
      },
      (err) => {
        // this.errorCmp.OpenWindow(this.getResponseErrorMessage(err, 'venue'));
      }
    )
    }

}
