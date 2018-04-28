import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgForm,FormControl} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';

import { BaseComponent } from '../../core/base/base.component';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

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
import { MapsAPILoader } from '@agm/core';
import { Http } from '@angular/http';
import { MainService } from '../../core/services/main.service';

declare var $:any;
declare var ionRangeSlider:any;

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})


export class EventsComponent extends BaseComponent implements OnInit {
    isMarkerVisible: boolean;
    mapLng: any;
    mapLat: any;
    mapCoords = {lat:0, lng:0};
    MapPosition = {
        lat:0,
        lng:0
    };
    Events:EventGetModel[] = [];

    MIN_DISTANCE:number = 10;
    MAX_DISTANCE:number = 10000;
    SearchParams: EventSearchParams = new EventSearchParams();
    
    Genres:GenreModel[] = [];
    ShowMoreGenres:boolean = false;

    TicketTypes:CheckModel<any>[] = [];
    TypesOfSpace:SelectModel[] = [];
    @ViewChild('SearchForm') form: NgForm;

    SearchDateRange:Date[] = [];

    @ViewChild('searchLocal') public searchElement: ElementRef;
    LocationText:string = '';
    bsConfig: Partial<BsDatepickerConfig>;

    ngOnInit()
    {   
        this.CreateAutocomplete();
        this.InitSearchParams();
        this.GetGenres();
        this.GetTicketTypes();
        this.GetAllTypesOfSpace();
        let _that = this;
        var distance_slider = $(".distance-slider").ionRangeSlider({
            type:"single",
            min: this.MIN_DISTANCE,
            max: this.MAX_DISTANCE,
            from: 10,
            hide_min_max: false,
            postfix: " km",
            grid: false,
            prettify_enabled: true,
            prettify_separator: ',',
            grid_num: 5,
            onChange: function(data)
            {
              _that.DistanceChanged(data);
            }
        });
        this.GetEvents();
        this.openSearch();
        this.initSlider();
        this.setHeightSearch();
        this.InitBsConfig();
    }

    GetAllTypesOfSpace()
    {
        this.TypesOfSpace = this.main.typeService.GetAllSpaceTypes();
    }

    GetTicketTypes()
    {
        this.TicketTypes = this.main.typeService.GetTicketTypes();
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

    InitSearchParams()
    {
        this.SearchParams.only_my = true;
        this.SearchParams.account_id = +localStorage.getItem('activeUserId');
    }

    InitBsConfig()
    {
        this.bsConfig = Object.assign({}, { containerClass: 'theme-default' });
    }

    DistanceChanged(data:any)
    {
      this.SearchParams.distance = data.from;
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

    aboutOpenMapModal()
    {
        $('#modal-map').modal('show');
    }

    CloseSearchWindow()
    {
        $("body").removeClass("has-active-menu");
        $(".mainWrapper").removeClass("has-push-left");
        $(".nav-holder-3").removeClass("is-active");
        $(".mask-nav-3").removeClass("is-active")
    }

    initSlider()
    {
        let _the = this;
        var price_slider = $(".current-slider").ionRangeSlider({
            type:"double",
            min: 10,
            max: 10000,
            from: 0,
            hide_min_max: false,
            prefix: " ",
            grid: false,
            prettify_enabled: true,
            prettify_separator: ',',
            grid_num: 5,
            onChange: function(data)
            {
              _the.PriceChanged(data);
            }
        });
    }

    PriceChanged(data)
    {}
    
    aboutDragMarker($event)
    {
        this.mapCoords.lat = $event.coords.lat;
        this.mapCoords.lng = $event.coords.lng;
        this.codeLatLng( this.mapCoords.lat, this.mapCoords.lng);
    }
    codeLatLng(lat, lng) 
    {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        this.SearchParams.lat = lat;
        this.SearchParams.lng = lng;
        geocoder.geocode(
            {'location': latlng }, 
            (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[1]) 
                    {
                        this.LocationText = results[1].formatted_address;
                    }
                } 
                else {
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
    
    GetEvents()
    {
        this.WaitBeforeLoading(
            () => this.main.eventService.EventsSearch(this.SearchParams),
            (res:EventGetModel[]) =>
            {
                this.Events = res;
                this.CloseSearchWindow();
            },
            (err) => {
                console.log(err);
                this.CloseSearchWindow();
            }
        );
    }

    ShowSearchResults()
    {
        //console.log(this.SearchDateRange);
        this.ConvertSearchDateRangeToSearchParams();
        this.ConvertGenreCheckboxes();
        this.ConvertTicketTypes();
        this.CheckDistance();

        // console.log(this.SearchParams);
        this.GetEvents();
    }

    CheckDistance()
    {
        if(!this.SearchParams.lat || !this.SearchParams.lng)
            this.SearchParams.distance = null;
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
            this.SearchParams.from_date = this.main.typeService.GetDateStringFormat(this.SearchDateRange[0]);
            this.SearchParams.to_date = this.main.typeService.GetDateStringFormat(this.SearchDateRange[1]);
        }
        else
        {
            this.SearchParams.from_date = "";
            this.SearchParams.to_date = "";
        }
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

    TypeOfSpaceChange($event)
    {
        this.SearchParams.size = [];
        if($event)
            this.SearchParams.size.push($event);
    }

    CreateAutocomplete()
    {
        this.mapsAPILoader.load().then(
            () => {
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
                                    //this.LocationText = place.formatted_address;
                                    this.SearchParams.lat = place.geometry.location.lat();
                                    this.SearchParams.lng = place.geometry.location.lng();
                                }
                            }
                        );
                    }
                );
            }
        );
    }
}
