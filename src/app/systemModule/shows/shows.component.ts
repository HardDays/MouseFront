import { Component, ViewChild, ElementRef, NgZone, Input, ViewContainerRef, ComponentFactory } from '@angular/core';
import { NgForm,FormControl,FormGroup,Validators} from '@angular/forms';
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
import { AccountType, BaseImages } from '../../core/base/base.enum';
import { GenreModel } from '../../core/models/genres.model';
import { EventCreateModel } from '../../core/models/eventCreate.model';

import { AccountService } from '../../core/services/account.service';
import { ImagesService } from '../../core/services/images.service';
import { TypeService } from '../../core/services/type.service';
import { GenresService } from '../../core/services/genres.service';
import { EventService } from '../../core/services/event.service';

import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { Router, Params } from '@angular/router';
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

declare var $:any;

@Component({
  selector: 'shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.css']
})


export class ShowsComponent extends BaseComponent implements OnInit {
  mapLat: number = 0;
  mapLng: number = 0;
  seeMore: boolean = false;
  isMarkerVisible: boolean = false;
  MIN_DISTANCE:number = 0;
  MAX_DISTANCE:number = 40;
  Roles = AccountType;
  SearchParams: EventSearchParams = new EventSearchParams();
  AccountTypes:SelectModel[] = [];
  Events:EventGetModel[] = [];
  Images:string[] = [];
  Genres:GenreModel[] = [];
  place: string='';
  VenueTypes:SelectModel[] = [];
  bsValue_start: Date;
  bsValue_end: Date;
  TicketTypes:TicketTypeModel[] = [];
  Artist:AccountGetModel[] = [];
  Venue:AccountGetModel[] = [];
  
  minDate: Date = new Date();

  mapCoords = {lat:0, lng:0};

  @ViewChild('search') public searchElement: ElementRef;
  @ViewChild('SearchForm') form: NgForm;
  SearchDateRange:Date[] = [];

  bsConfig: Partial<BsDatepickerConfig>;


  ngOnInit()
  {
    this.WaitBeforeLoading(
      () => this.main.genreService.GetAllGenres(),
      (genres:string[])=> {
        this.Genres = this.main.genreService.GetGendreModelFromString([], this.main.genreService.StringArrayToGanreModelArray(genres));
        this.seeFirstGenres();
      }
    );

    let _that = this;
    $(".nav-button").on("click", function (e) {
      _that.setHeightSearch();
      e.preventDefault();
      $("body").addClass("has-active-menu");
      $(".mainWrapper").addClass("has-push-left");
      $(".nav-holder-3").addClass("is-active");
      $(".mask-nav-3").addClass("is-active");
    });

    $(".menu-close, .mask-nav-3").on("click", function (e) {
      e.preventDefault();
      _that.CloseSearchWindow();
    });

    var distance_slider = $(".distance-slider").ionRangeSlider({
      type:"single",
      min: this.MIN_DISTANCE,
      max: this.MAX_DISTANCE,
      from: 0,
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

    this.bsValue_start = new Date();
    this.bsValue_end = new Date();

    this.VenueTypes = this.main.typeService.GetAllSpaceTypes();
    this.TicketTypes = this.main.typeService.GetAllTicketTypes();

    this.GetEvents();
    this.CreateAutocomplete();
    this.setHeightSearch();
    this.InitBsConfig();
  }

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
  InitBsConfig()
  {
      this.bsConfig = Object.assign({}, { containerClass: 'theme-default' });
  }
  CloseSearchWindow()
  {
    $("body").removeClass("has-active-menu");
    $(".mainWrapper").removeClass("has-push-left");
    $(".nav-holder-3").removeClass("is-active");
    $(".mask-nav-3").removeClass("is-active")
  }

  GetEvents()
  {
    this.ParseSearchParams();
    this.WaitBeforeLoading(
      () => this.main.eventService.EventsSearch(this.SearchParams),
      (res:EventGetModel[])=>{
        this.Events = res;
        this.setHeightSearch();
        this.GetImages();
      })
      
  }

  aboutOpenMapModal()
  {
    $('#modal-map').modal('show');
  }
  
  ShowSearchResults() {
    this.GetEvents();
    this.CloseSearchWindow();
  }

  GetImages()
  {
    for(let i in this.Events) {
      if(this.Events[i] && this.Events[i].image_id)
      {
        this.WaitBeforeLoading(
          () => this.main.imagesService.GetImageById(this.Events[i].image_id),
          (res:Base64ImageModel)=>{
            this.Images[this.Events[i].id] = res.base64;
          }
        );
      }
    }
  }

  DistanceChanged(data:any)
  {
    this.SearchParams.distance = data.from;
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

  ParseSearchParams()
  {
    this.ConvertSearchDateRangeToSearchParams();
    if(this.TicketTypes) 
    {
      this.SearchParams.ticket_types = [];
      for(let item of this.TicketTypes) 
      {
        if(item.checked)
          this.SearchParams.ticket_types.push(item.value);
      }
    }

    if(this.Genres)
    {
      this.SearchParams.genres = [];
      for(let item of this.Genres) {
        if(item.checked)
          this.SearchParams.genres.push(item.genre);
      }
    }
  }

  aboutDragMarker($event)
  {
      this.mapCoords.lat = $event.coords.lat;
      this.mapCoords.lng = $event.coords.lng;
      this.codeLatLng( this.mapCoords.lat, this.mapCoords.lng);
  }
  
  CreateAutocomplete()
  {
    this.mapsAPILoader.load().then(
      () => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {types:[`(cities)`]});
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
                else {
                  this.SearchParams.location = autocomplete.getPlace().formatted_address;
                  this.mapLat = autocomplete.getPlace().geometry.location.toJSON().lat;
                  this.mapLng = autocomplete.getPlace().geometry.location.toJSON().lng;
                }
              }
            );
          }
        );
      }
    );
  }


  codeLatLng(lat, lng) 
  {
    let geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode(
      {'location': latlng }, 
      (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            $("#searchAddress").val(results[1].formatted_address);
            this.SearchParams.location = results[1].formatted_address;
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

  seeFirstGenres()
  {
    for(let g of this.Genres) g.show = false;
    if(this.Genres[0])
    this.Genres[0].show = true;
    if(this.Genres[1])
    this.Genres[1].show = true;
    if(this.Genres[2])
    this.Genres[2].show = true;
    if(this.Genres[3])
    this.Genres[3].show = true;
    this.seeMore = false;
  }

  seeMoreGenres()
  {
    this.seeMore = true;
    for(let g of this.Genres) g.show = true;
  }
  incr(n:number)
  {
    return n+1;
  }
}
  
