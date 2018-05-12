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
import { AccountType } from '../../core/base/base.enum';
import { GenreModel } from '../../core/models/genres.model';
import { EventCreateModel } from '../../core/models/eventCreate.model';

import { AccountService } from '../../core/services/account.service';
import { ImagesService } from '../../core/services/images.service';
import { TypeService } from '../../core/services/type.service';
import { GenresService } from '../../core/services/genres.service';
import { EventService } from '../../core/services/event.service';

import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
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
import { TicketsSearchParams } from '../../core/models/ticketsSearchParams.model';
import { TicketsGetModel } from '../../core/models/ticketsGetModel';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { MainService } from '../../core/services/main.service';

declare var $:any;

@Component({
  selector: 'tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})


export class TicketsComponent extends BaseComponent implements OnInit,AfterViewChecked {
  Genres:GenreModel[] = [];
  ShowMoreGenres:boolean = false;
  isMarkerVisible: boolean;
  mapLng: any;
  mapLat: any;
  mapCoords = {lat:55.755826, lng:37.6172999};
  SearchParams: TicketsSearchParams = new TicketsSearchParams();
  TypesOfSpace:SelectModel[] = [];
  TicketTypes:CheckModel<any>[] = [];
  accountId:number;
  Tickets:TicketsGetModel[] = [];
  PastTickets:TicketsGetModel[] = [];
  SearchDateRange:Date[] = [];
  bsConfig: Partial<BsDatepickerConfig>;
  ticketsTypesDates = ['current','past']


  @ViewChild('SearchForm') form: NgForm;

  @ViewChild('searchLocal') public searchElement: ElementRef;
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
        this.CreateAutocomplete();
        this.initUser();
        this.GetTicketTypes();
        this.setHeightSearch();
        this.GetGenres();
        this.openSearch();
    }

    ngAfterViewChecked()
    {
        this.cdRef.detectChanges();
    }

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

    GetTicketTypes()
    {
        this.TicketTypes = this.main.typeService.GetMyTicketTypes();
    }
    ShowSearchResults()
    {
        this.ConvertSearchDateRangeToSearchParams();
        this.ConvertGenreCheckboxes();
        this.ConvertTicketTypes();
        this.GetTicketsSearch();
    }

    ConvertTicketTypes()
    {
        this.SearchParams.ticket_types = this.main.typeService.TicketTypesArrayToStringArray(this.TicketTypes);
    }

    ConvertGenreCheckboxes()
    {
        this.SearchParams.genres = this.main.genreService.GenreModelArrToStringArr(this.Genres);
    }

    ConvertSearchDateRangeToSearchParams()
    {
        if(this.SearchDateRange && this.SearchDateRange.length == 2)
        {
            this.SearchParams.date_from = this.main.typeService.GetDateStringFormat(this.SearchDateRange[0]);
            this.SearchParams.date_to = this.main.typeService.GetDateStringFormat(this.SearchDateRange[1]);
        }
        else{
            this.SearchParams.date_from = "";
            this.SearchParams.date_to = "";
        }
    }
    GetTickets()
    {
        this.WaitBeforeLoading(
            () => this.main.eventService.GetAllTicketsCurrent(this.SearchParams.account_id,'current'),
            (res:TicketsGetModel[]) => {
                this.Tickets = res;
                console.log(res);
            },
            (err) => {
              //  console.log(err);
            }
        );
    }

    GetTicketsSearch()
    {
        this.SearchParams.location = this.LocationText;
       
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


    GetGenres()
    {
        this.WaitBeforeLoading(
            () => this.main.genreService.GetAllGenres(),
            (res:string[]) => {
                this.Genres = this.main.genreService.SetHiddenGenres(this.main.genreService.StringArrayToGanreModelArray(res));
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

    aboutDragMarker($event)
    {
        this.mapCoords.lat = $event.coords.lat;
        this.mapCoords.lng = $event.coords.lng;
        this.codeLatLng( this.mapCoords.lat, this.mapCoords.lng);
    }
    codeLatLng(lat, lng) {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode(
            {'location': latlng }, 
            (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) 
                {
                    if (results[1]) 
                    {
                        this.LocationText = results[1].formatted_address;
                    }
                } 
                else 
                {
                    alert('Geocoder failed due to: ' + status);
                }
            }
        );
    }

    mapClick($event)
    {
        this.mapLat = $event.coords.lat;
        this.mapLng = $event.coords.lng;
        this.isMarkerVisible = true;
        this.codeLatLng(this.mapLat,this.mapLng);
    }

    setHeightSearch()
    {
        //console.log($('.main-router-outlet .main-router-outlet').height(),$(window).height());
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

    CreateAutocomplete()
    {
        this.mapsAPILoader.load().then(
            () => {
            //(this.searchElement.nativeElement, {types:[`(cities)`]})
                let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement);

                autocomplete.addListener(
                    "place_changed",
                     () => {
                        this.ngZone.run(
                            () => {
                                let place: google.maps.places.PlaceResult = autocomplete.getPlace();  
                                if(place.geometry === undefined || place.geometry === null )
                                {             
                                    return;
                                }
                                else 
                                {
                                    this.LocationText = autocomplete.getPlace().formatted_address;
                                    //this.LocationText = place.formatted_address;
                                    this.mapCoords.lat = place.geometry.location.lat();
                                    this.mapCoords.lng = place.geometry.location.lng();
                                }
                            }
                        );
                    }
                );
            }
        );
    }

}












  
