import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../../core/base/base.component';
import { AccountGetModel } from '../../../../core/models/accountGet.model';
import { BaseImages } from '../../../../core/base/base.enum';
import { CalendarDate } from '../../../../systemModule/venueCreate/big-calendar/big-calendar.component';
import { VenueDatesModel } from '../../../../core/models/venueDatesModel';
import * as moment from 'moment';

declare var $:any;

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent extends BaseComponent implements OnInit {

  changedPrice: CalendarDate[] = [];
  disabledDays: CalendarDate[] = [];
  eventsDates:CalendarDate[] = [];

  OffHours: any[] = [];
  OpHours: any[] = [];

  @Input() Account:AccountGetModel;
  @Input() CurrencySymbol:string;
  photos:any = [];

  ngOnInit() {
    this.Init();
    this.getVenueImages();
    this.ChangeDates();
  }

  ngOnChanges(change: SimpleChanges){
    if(change.Account){
      this.Init();
    }
  }

  Init()
  {
    if(this.Account.image_id){
      this.main.imagesService.GetImageById(this.Account.image_id)
        .subscribe(
          (img)=>{
            if(img.base64)
              this.Account.image_base64_not_given = img.base64;
            else
              this.Account.image_base64_not_given = BaseImages.NoneFolowerImage;
          },
          (err)=>{
            this.Account.image_base64_not_given = BaseImages.NoneFolowerImage;
          });
      }
      else this.Account.image_base64_not_given = BaseImages.NoneFolowerImage;


      if(this.Account.office_hours)
          this.OffHours = this.main.accService.ParseWorkingTimeModelArr(this.Account.office_hours);
      
      if(this.Account.operating_hours)
          this.OpHours = this.main.accService.ParseWorkingTimeModelArr(this.Account.operating_hours);
  }

  ChangeDates(NewDate?:Date)
  {
      let params = null;
      if(NewDate){
          params = {
              current_date: NewDate
          };
      }

      this.changedPrice = [];
      this.disabledDays = [];
      this.eventsDates = [];
      if(this.Account.id){
          this.main.accService.GetVenueDates(this.Account.id ,params)
          .subscribe(
              (res:any) => {
                  let arr = [];
                  for(let i in res.dates)
                  {
                      let item:VenueDatesModel = res.dates[i];
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

                  if(res.event_dates)
                  {

                      for(let item of res.event_dates)
                      {
                          this.eventsDates.push({
                              mDate: moment(item.date_from),
                              event: true,
                              eventId: item.id
                          });
                      }
                  }
              }
          );
      }
  }

  ngAfterViewInit(){
    setTimeout(() => {
      $('.photos-abs-wrapp').css({
        'max-height': $('.rel-wr-photoos').width()+'px'
      });


    $(window).resize(function(){
        $('.photos-abs-wrapp').css({
            'max-height': $('.rel-wr-photoos').width()+'px'
        });

    });
    }, 5000);



  // this.InitMusicPlayer();
  }

  getVenueImages(){
    this.photos = [];
    this.main.accService.GetImagesVenue(this.Account.id)
    .subscribe((im)=>{

      for(let oneRes of im.images)
      this.WaitBeforeLoading(
        () => this.main.imagesService.GetImageById(oneRes.id),
        (res:any) => {
          // console.log(oneRes);
             let p = {
              id:res.id,
              base64:res.base64,
              size: {width:500,height:500},
              type: oneRes.type,
              description: oneRes.description
            };
            this.main.imagesService.GetImageSize(p.id)
              .subscribe((res:any) => {
                p.size.width = res.width;
                p.size.height = res.height;
            },
              (err) =>{
            });
            this.photos.push(p);
            // console.log(this.photos);
          },
        (err) => {
        }
    );
    });
  }

  toBeatyType(el:string){
    if(el)
      return el.replace('_',' ');
    else return '';
  }

}
