import { Component, ViewChild, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { NgForm,FormControl} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';

import { BaseComponent } from '../../core/base/base.component';
import { OnInit, AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';

import { SelectModel } from '../../core/models/select.model';
import { FrontWorkingTimeModel } from '../../core/models/frontWorkingTime.model';
import { WorkingTimeModel } from '../../core/models/workingTime.model';
import { AccountCreateModel } from '../../core/models/accountCreate.model';
import { EventDateModel } from '../../core/models/eventDate.model';
import { ContactModel } from '../../core/models/contact.model';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { AccountType, AccountStatus } from '../../core/base/base.enum';
import { GenreModel } from '../../core/models/genres.model';
import { AccountSearchParams } from '../../core/models/accountSearchParams.model';
import { EventGetModel } from '../../core/models/eventGet.model';
import { EventSearchParams } from '../../core/models/eventSearchParams';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { CheckModel } from '../../core/models/check.model';
import { AccountService } from '../../core/services/account.service';
import { ImagesService } from '../../core/services/images.service';
import { TypeService } from '../../core/services/type.service';
import { GenresService } from '../../core/services/genres.service';
import { EventService } from '../../core/services/event.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'angular2-social-login';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { Http } from '@angular/http';
import { MainService } from '../../core/services/main.service';
import { AnalyticsEventComponent } from './analytics/analytics.component';
import { SearchEventsComponent } from '../../shared/search/search_window/search.component';
import { SearchEventsMapComponent } from '../../shared/search/map/map.component';
import { ErrorComponent } from '../../shared/error/error.component';
import { TranslateService } from '../../../../node_modules/@ngx-translate/core';
import { SettingsService } from '../../core/services/settings.service';

declare var $:any;

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})


export class EventsComponent extends BaseComponent implements OnInit,AfterViewChecked {

    @ViewChild('errorCmp') errCmp:ErrorComponent;
    
    Events:EventGetModel[] = [];
    SearchParams: EventSearchParams = new EventSearchParams();

    Acc = this.main.CurrentAccount;
    Status = AccountStatus;

    MyCoords = {
        lat:0,
        lng:0
    }
    isShowMap = false;
    
    ScrollDisabled = true;
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

    ngAfterViewChecked()
    {
        this.cdRef.detectChanges();
    }

    ngOnInit()
    {   
        this.SearchParams.only_my = true;
        this.SearchParams.account_id = this.GetCurrentAccId();
        
        this.SearchParams.offset = 0;
        this.SearchParams.limit = 8;
        this.GetEvents();
        this.openSearch();
        this.setHeightSearch();

        if(navigator.geolocation && !(navigator.geolocation === undefined)){
            // console.log(`navigator.geolocation`);
            navigator.geolocation.getCurrentPosition((position) => {
                this.MyCoords.lat = position.coords.latitude;
                this.MyCoords.lng = position.coords.longitude - 2;

                // console.log(`position.coords`,position.coords,this.MyCoords);
                if(this.MyCoords.lat === 0 && this.MyCoords.lng === 0)
                    this.getPosition();

            },(err)=>{
                // console.log(`error`);
                this.getPosition();
            },{
                timeout: 10000
            });
        } else {
           this.getPosition()
        }
    }

    getPosition(){
        //console.log(`api.ipstack`);
        // $.getJSON('http://api.ipstack.com/check?access_key=428075a8fe82f2d6de7696b9bfec35b8', (data)=>{
        //     console.log(data);
        //     this.MyCoords.lat = data.latitude;
        //     this.MyCoords.lng = data.longitude - 2;
        // });
        // console.log(`service`);
        this.main.accService.GetLocation()
            .subscribe((data)=>{
                // console.log(`data`,data);
                this.MyCoords.lat = data.location[0];
                this.MyCoords.lng = data.location[1] - 2;
            })

    }

    @ViewChild('search') search: SearchEventsComponent;
    
    @ViewChild('mapForm') mapForm : SearchEventsMapComponent;
     @ViewChild('map') map : AgmMap;

    @ViewChild('analyt') analyt : AnalyticsEventComponent;
    GetEvents(params?:EventSearchParams)
    {
        this.ScrollDisabled = true;
        this.WaitBeforeLoading(
            () => this.main.eventService.EventsSearch(this.SearchParams),
            (res:EventGetModel[]) =>
            {
                this.Events = res;
                setTimeout(()=>{this.ScrollDisabled = false},500);
            },
            (err) => {
            }
        );
    }
    
    setHeightSearch()
    {
        if($('.main-router-outlet .main-router-outlet').height() < $(window).height()){
          $('.wrapp-for-filter').css({
             "height": $('.for-flex-height').height()-150
          });
        }
      else{
         $('.wrapp-for-filter').css({
             "height": '100%'
          }); 
      }
    }

    openMap(){
        this.isShowMap = !this.isShowMap;
        this.map.triggerResize();
    }

    

    analiticsClick()
    {
        $('#modal-analytics').modal('show');
    }

    
    openSearch()
    {
        let _that = this;
        $(".nav-button").on("click", function (e) {
            _that.setHeightSearch();
            e.preventDefault();
            $("body").addClass("has-active-menu");
            $(".mainWrapper").addClass("has-push-left");
            $(".nav-holder-3").addClass("is-active");
            $(".mask-nav-3").addClass("is-active")
        });
        $(".menu-close, .mask-nav-3").on("click", function (e) {
            e.preventDefault();
            $("body").removeClass("has-active-menu");
            $(".mainWrapper").removeClass("has-push-left");
            $(".nav-holder-3").removeClass("is-active");
            $(".mask-nav-3").removeClass("is-active")
        });
    }

    OpenMap(params)
    {
        this.mapForm.AboutOpenMapModal(params);
    }

    TransferMapToSearch(params)
    {
        this.search.GetLocation(params);
    }
    ShowAnalytics($event)
    {
        this.analyt.ShowWindow($event);
    }

    HiddenGetEvents()
    {
        this.main.eventService.EventsSearch(this.SearchParams)
            .subscribe(
                (res:EventGetModel[]) =>
                {
                    if(res && res.length){
                        for(let item of res)
                        {
                            if(!this.Events.find(obj => obj.id == item.id))
                            {
                                this.Events.push(item);
                            }
                        }
                    }
                },
                (err) => {
                }
            );
    }

    onScroll () 
    {
        this.SearchParams.offset = this.Events.length;
        this.HiddenGetEvents();
    }
    
    addEvent(){
        
        if(+this.main.GetCurrentAccId()>0)
            this.router.navigate(['/system','eventCreate','new']);
        else
            // console.log(`No profile`);
            this.errCmp.OpenWindow('Please create a profile first')
    }

}
