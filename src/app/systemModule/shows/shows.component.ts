import { Component, ViewChild, ElementRef, NgZone, Input, ViewContainerRef, ComponentFactory, ChangeDetectorRef } from '@angular/core';
import { NgForm,FormControl,FormGroup,Validators} from '@angular/forms';
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
import { AccountType, BaseImages } from '../../core/base/base.enum';
import { GenreModel } from '../../core/models/genres.model';
import { EventCreateModel } from '../../core/models/eventCreate.model';

import { AccountService } from '../../core/services/account.service';
import { ImagesService } from '../../core/services/images.service';
import { TypeService } from '../../core/services/type.service';
import { GenresService } from '../../core/services/genres.service';
import { EventService } from '../../core/services/event.service';

import { MapsAPILoader, AgmMap } from '@agm/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { AuthService } from "angular2-social-login";
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { AccountAddToEventModel } from '../../core/models/artistAddToEvent.model';
import { EventGetModel } from '../../core/models/eventGet.model';
import { AccountSearchModel } from '../../core/models/accountSearch.model';
import { Http } from '@angular/http';
import { Point } from '@agm/core/services/google-maps-types';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AgmCoreModule } from '@agm/core';
import { CheckModel } from '../../core/models/check.model';
import { EventSearchParams } from '../../core/models/eventSearchParams';
import { TicketTypeModel } from '../../core/models/ticketType.model';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { MainService } from '../../core/services/main.service';
import { SearchEventsComponent } from '../../shared/search/search_window/search.component';
import { SearchEventsMapComponent } from '../../shared/search/map/map.component';
import { TranslateService } from '../../../../node_modules/@ngx-translate/core';
import { SettingsService } from '../../core/services/settings.service';

declare var $:any;

@Component({
  selector: 'shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.css']
})


export class ShowsComponent extends BaseComponent implements OnInit,AfterViewChecked{
    Events:EventGetModel[] = [];
    SearchParams: EventSearchParams = new EventSearchParams();
    ScrollDisabled = true;
    isShowMap = false;
    MyCoords = {
        lat:0,
        lng:0
    }

    @ViewChild('map') map : AgmMap;

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

    ngOnInit()
    {
        this.SearchParams.is_active = true;
        this.SearchParams.offset = 0;
        this.SearchParams.limit = 6;
        this.GetEvents();
        this.openSearch();
        this.setHeightSearch();

         //this.getPosition();
        if(navigator.geolocation && !(navigator.geolocation === undefined)){
            navigator.geolocation.getCurrentPosition((position) => {
                this.MyCoords.lat = position.coords.latitude;
                this.MyCoords.lng = position.coords.longitude - 2;

                if(this.MyCoords.lat === 0 && this.MyCoords.lng === 0)
                    this.getPosition();

            },(err)=>{
                this.getPosition();
            },{
                timeout: 10000
            });
        } else {
           this.getPosition()
        }

        if(!this.MyUser.id)
          this.showFirstMouseOpeningModal();
    }

    showFirstMouseOpeningModal(){
      $('.slider-modal-wr').slick({
            dots: false,
            arrows: true,
              infinite: true,
              slidesToShow: 1

        });
      $('#modal-slider').modal('show');
    }
    signUpNavigation(){
      $('#modal-slider').modal('toggle');
      this.router.navigate(['/register']);
    }

    getPosition(){
        // $.getJSON('http://api.ipstack.com/check?access_key=428075a8fe82f2d6de7696b9bfec35b8', (data)=>{
        //     this.MyCoords.lat = data.latitude;
        //     this.MyCoords.lng = data.longitude - 2;
        // });
        this.main.accService.GetLocation()
            .subscribe((data)=>{

                this.MyCoords.lat = data.location[0];
                this.MyCoords.lng = data.location[1] - 2;
            })

    }

    openMap(){


        this.isShowMap = !this.isShowMap;

        if(this.map){
            this.map.triggerResize();
        }


    }

    mapClick(){
    }

    ngAfterViewChecked()
    {
        this.cdRef.detectChanges();
    }

    openShow(id:number){
        this.router.navigate(['/system','shows_detail',id]);
    }

    @ViewChild('search') search: SearchEventsComponent;

    @ViewChild('mapForm') mapForm : SearchEventsMapComponent;

    setHeightSearch(){
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

    onOpenSearch(){
        if(this.isShowMap)
            this.isShowMap = false;
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
            $(".mask-nav-3").addClass("is-active");
            if($(window).scrollTop()>0 && $(window).scrollTop()<125){
                $(".nav-holder-3").css({'padding-top':(125-$(window).scrollTop())+'px'});
            }
            else if($(window).scrollTop()>0 && $(window).scrollTop()>=125){
                $(".nav-holder-3").css({'padding-top':'15px'});
            }
            else{
                $(".nav-holder-3").css({'padding-top':'125px'});
            }

        });
        $(".menu-close, .mask-nav-3,.at-map").on("click", function (e) {
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

    GetEvents(params?:EventSearchParams)
    {

        this.ScrollDisabled = true;
        this.WaitBeforeLoading(
            () => this.main.eventService.EventsSearch(this.SearchParams),
            (res:EventGetModel[]) =>
            {
                this.Events = res;
                this.ScrollDisabled = false;
            },
            (err) => {
            }
        );
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
}

