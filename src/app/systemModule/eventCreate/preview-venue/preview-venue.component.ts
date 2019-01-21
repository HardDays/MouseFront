import { Component, OnInit, EventEmitter, Output, Input, NgZone, ChangeDetectorRef } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { BaseImages } from '../../../core/base/base.enum';
import { VenueDatesModel } from '../../../core/models/venueDatesModel';
import * as moment from 'moment';
import { CalendarDate } from '../../venueCreate/big-calendar/big-calendar.component';
import { Currency } from '../../../core/models/preferences.model';
import { TranslateService } from '../../../../../node_modules/@ngx-translate/core';
import { SettingsService } from '../../../core/services/settings.service';
declare var $:any;

@Component({
  selector: 'app-preview-venue',
  templateUrl: './preview-venue.component.html',
  styleUrls: ['./preview-venue.component.css']
})
export class PreviewVenueComponent extends BaseComponent implements OnInit {
  changedPrice: CalendarDate[] = [];
  disabledDays: CalendarDate[] = [];
  eventsDates:CalendarDate[] = [];

  @Input() VenueId:number;
  @Input() CreatorId:number;
  @Input() EventId:number;
  @Output() OnReturn = new EventEmitter();

  photos:any = [];

  Venue:AccountGetModel = new AccountGetModel();

  OffHours: any[] = [];
  OpHours: any[] = [];
  MyCurrency:string = Currency.USD;

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
    scrollTo(0,0);
    this.MyCurrency = this.main.settings.GetCurrency();
    this.WaitBeforeLoading(
      ()=>this.main.accService.GetAccountPreviewById(this.EventId,this.CreatorId,this.VenueId),
      (res:AccountGetModel)=>{
        this.Venue = res;
        this.GetVenueHours();
        if(res.image_id){
         this.main.imagesService.GetImageById(res.image_id)
           .subscribe((img)=>{
             this.Venue.image_base64_not_given = img.base64;
           });
         }
         else this.Venue.image_base64_not_given = BaseImages.NoneFolowerImage;

         this.getVenueImages();
         this.scrollerPhotos();
      }
     )
     this.ChangeDates();
  }

  GetVenueHours()
    {
        this.OpHours = [];
        this.OffHours = [];
        if(this.Venue.office_hours)
            this.OffHours = this.main.accService.ParseWorkingTimeModelArr(this.Venue.office_hours);

        if(this.Venue.operating_hours)
            this.OpHours = this.main.accService.ParseWorkingTimeModelArr(this.Venue.operating_hours);
    }

  // ngAfterViewInit(){
  //   $('.photos-abs-wrapp').css({
  //     'max-height': $('.rel-wr-photoos').width()+'px'
  // });
  // $('.new-photos-wr-scroll-preview').css({
  //     'padding-left':$('.for-position-left-js').offset().left
  // });

  // $(window).resize(function(){
  //     $('.photos-abs-wrapp').css({
  //         'max-height': $('.rel-wr-photoos').width()+'px'
  //     });
  //     $('.new-photos-wr-scroll-preview').css({
  //         'padding-left':$('.for-position-left-js').offset().left
  //     });
  // });


  // // this.InitMusicPlayer();
  // }

  ngAfterViewInit(){
    this.scrollerPhotos();



  // this.InitMusicPlayer();
  }

  scrollerPhotos(){
    setTimeout(() => {
      $('.photos-abs-wrapp').css({
        'max-height': $('.rel-wr-photoos').width()+'px'
      });
      $('.new-photos-wr-scroll-preview').css({
        'padding-left': $('.for-position-left-js').offset()?$('.for-position-left-js').offset().left:0
      });

    $(window).resize(function(){
        $('.photos-abs-wrapp').css({
            'max-height': $('.rel-wr-photoos').width()+'px'
        });
        $('.new-photos-wr-scroll-preview').css({
            'padding-left': $('.for-position-left-js').offset()?$('.for-position-left-js').offset().left:0
        });
    });
    }, 5000);
  }

  getVenueImages(){
      this.photos = [];
      this.main.accService.GetImagesVenue(this.Venue.id)
      .subscribe((im)=>{

        for(let oneRes of im.images)
        this.WaitBeforeLoading(
          () => this.main.imagesService.GetImageById(oneRes.id),
          (res:any) => {
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

  backPage(){
    this.OnReturn.emit();
  }

  scrollTo(part:string){
    let page = '#'+part+'Page';
    $('html, body').animate({
      scrollTop: $(page).offset().top
    }, 1000);

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
      if(this.VenueId){
          this.main.accService.GetVenueDates(this.VenueId,params)
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
                          changed:true,
                          currency: item.currency? item.currency : this.MyCurrency
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




}
