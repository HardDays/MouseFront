import { Component, ViewChild, ElementRef, NgZone, Input, ViewContainerRef, ComponentFactory, ChangeDetectorRef, Output } from '@angular/core';
import { NgForm,FormControl,FormGroup,Validators} from '@angular/forms';
import { BaseComponent } from '../../core/base/base.component';
import { OnInit, AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { AuthService } from "angular2-social-login";
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { Point } from '@agm/core/services/google-maps-types';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { SearchTicketsComponent } from './search/search.component';
import { SearchTicketsMapComponent } from './map/map.component';
import { TicketsSearchParams } from '../../core/models/ticketsSearchParams.model';
import { TicketsGetModel } from '../../core/models/ticketsGetModel';
import { MainService } from '../../core/services/main.service';
import * as moment from 'moment';
declare var $:any;

@Component({
  selector: 'tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})


export class TicketsComponent extends BaseComponent implements OnInit,AfterViewChecked {
  SearchParams: TicketsSearchParams = new TicketsSearchParams();
  accountId:number;
  Tickets:TicketsGetModel[] = [];
  PastTickets:TicketsGetModel[] = [];
  ticketsTypesDates = ['current','past'];
  


//   DisabledDates: CalendarDate[] = [
//     {mDate: moment('2018-06-13')},
//     {mDate: moment("14-06-2018", "DD-MM-YYYY")},
//     {mDate: moment('2018-06-24')}
//   ];
//   EventDates: CalendarDate[] = [
//     {
//         mDate: moment('2018-06-16'),
//         eventId: 32
//     },
//     {
//         mDate: moment('2018-06-15'),
//         eventId: 31
//     },
//     {
//         mDate: moment('2018-07-15'),
//         eventId: 22
//     },
//     {
//         mDate: moment('2018-07-22'),
//         eventId: 28
//     }
//   ];

  @ViewChild('search') search: SearchTicketsComponent;
//   @ViewChild('calendar') calendar:TinyCalendarComponent;
    
  @ViewChild('mapForm') mapForm : SearchTicketsMapComponent;
  


    LocationText:string = '';
   
    constructor(
        protected main           : MainService,
        protected _sanitizer     : DomSanitizer,
        protected router         : Router,
        protected mapsAPILoader  : MapsAPILoader,
        protected ngZone         : NgZone,
        protected activatedRoute : ActivatedRoute,
        protected cdRef          : ChangeDetectorRef
    ) {
    super(main,_sanitizer,router,mapsAPILoader,ngZone,activatedRoute);
    }

    ngOnInit()
    {
        this.initUser();
        this.setHeightSearch();
        this.openSearch();
    }

  
    ngAfterViewChecked()
    {
        this.cdRef.detectChanges();
    }
    // DisableDate(event){
    //    if(!event.event){ 
    //         if(!event.selected){
    //             this.DisabledDates.push({
    //                 mDate: event.mDate
    //             });
    //         }
    //         else{
    //             let BreakException = {};
    //             try {
    //                 this.DisabledDates.forEach(function(e,index,arr){
    //                     if(e.mDate.date() == event.mDate.date()){
    //                         arr.splice(index,1);
    //                         throw BreakException;
    //                     }
    //                 });
    //             } catch (e) {
    //                 if (e !== BreakException) throw e;
    //             }
    //         }
    //     }
    // }

    initUser()
    {
        if(this.isLoggedIn)
        {
            this.SearchParams.account_id = this.GetCurrentAccId();
            if(!this.SearchParams.account_id)
            {
                // this.GetMyAccounts(
                //     () =>{},
                //     () => {
                //         this.GetCurrentAccId();
                //         this.GetTickets();
                //         this.GetTicketsPast();
                //     }
                // )
            }
            else{
                this.GetTickets();
                this.GetTicketsPast();
            }
        }
    }

   
    ShowSearchResults(params:any)
    {
        this.GetTicketsSearch();
    }


    GetTickets()
    {
        this.WaitBeforeLoading(
            () => this.main.eventService.GetAllTicketsCurrent(this.SearchParams.account_id,'current'),
            (res:TicketsGetModel[]) => {
                this.Tickets = res;
                
            },
            (err) => {
              //  console.log(err);
            }
        );
    }

    GetTicketsSearch()
    {
        for(let i of this.ticketsTypesDates)
        {
            this.SearchParams.time = i;
            this.WaitBeforeLoading(
                () => this.main.eventService.MyTicketsSearch(this.SearchParams),
                (res:TicketsGetModel[]) =>{
                    if(i == 'current'){
                        this.Tickets = res;
                    }
                    if(i == 'past'){
                        this.PastTickets = res;
                      
                    }
                    this.CloseSearchWindow();
                },
                (err) => {
                    this.CloseSearchWindow();
                }
            );
        }
    }
    

    GetTicketsPast()
    {
        this.WaitBeforeLoading(
            () => this.main.eventService.GetAllTicketsCurrent(this.SearchParams.account_id,'past'),
            (res:TicketsGetModel[]) => {
                this.PastTickets = res;
            },
            (err) => {
               // console.log(err);
            }
        );
    }

    CloseSearchWindow()
    {
        $("body").removeClass("has-active-menu");
        $(".mainWrapper").removeClass("has-push-left");
        $(".nav-holder-3").removeClass("is-active");
        $(".mask-nav-3").removeClass("is-active")
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

    
   
    setHeightSearch()
    {
       
        if($('.main-router-outlet .main-router-outlet').height() < $(window).height())
        {
            $('.wrapp-for-filter').css(
                {
                    "height": $('.for-flex-height').height()-150
                }
            );
            //console.log(`one`);
        }
        else
        {
            $('.wrapp-for-filter').css(
                {
                    "height": '100%'
                }
            ); 
            //console.log(`two`);
        }
    }

    aboutOpenMapModal()
    {
        $('#modal-map').modal('show');
    }

    OpenMap(params)
    {
        this.mapForm.AboutOpenMapModal(params);
    }
    TransferMapToSearch(params)
    {
        this.search.GetLocation(params);
    }


}












  
