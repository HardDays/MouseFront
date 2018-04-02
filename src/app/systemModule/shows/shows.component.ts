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

declare var $:any;

@Component({
  selector: 'shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.css']
})


export class ShowsComponent extends BaseComponent implements OnInit {
  MIN_DISTANCE:number = 0;
  MAX_DISTANCE:number = 100000;
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
  
  constructor(protected authService: AuthMainService,
    protected accService:AccountService,
    protected imgService:ImagesService,
    protected typeService:TypeService,
    protected genreService:GenresService,
    protected eventService:EventService,
    protected _sanitizer: DomSanitizer,
    protected router: Router,public _auth: AuthService,
    private mapsAPILoader: MapsAPILoader, protected h:Http,
    private ngZone: NgZone){
      super(authService,accService,imgService,typeService,genreService,eventService,_sanitizer,router,h,_auth);
  }

  ngOnInit(){

    this.genreService.GetAllGenres()
    .subscribe((genres:string[])=> {
      this.Genres = this.genreService.GetAll();
  });
    $(".nav-button").on("click", function (e) {
      e.preventDefault();
      $("body").addClass("has-active-menu");
      $(".mainWrapper").addClass("has-push-left");
      $(".nav-holder-3").addClass("is-active");
      $(".mask-nav-3").addClass("is-active")
    });
    
    let _that = this;

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
//   var capacity_slider = $(".capacity-slider").ionRangeSlider({
//     type:"double",
//     min: this.MIN_CAPACITY,
//     max: this.MAX_CAPACITY,
//     from: 0,
//     hide_min_max: false,
//     prefix: "",
//     grid: false,
//     prettify_enabled: true,
//     prettify_separator: ',',
//     grid_num: 5
//     // onChange: function(data)
//     // {
//     //   _that.CapacityChanged(data);
//     // }
// });
    this.bsValue_start = new Date();
    this.bsValue_end = new Date();


    this.VenueTypes = this.typeService.GetAllVenueTypes();
    this.TicketTypes = this.typeService.GetAllTicketTypes();
    this.GetEvents();

    this.CreateAutocomplete();
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
    this.eventService.EventsSearch(this.SearchParams)
      .subscribe((res:EventGetModel[])=>{
        this.Events = res;
        //TODO: Из списка артистов по каждому ивенту
        console.log("1", this.Events);
      })
  }

  aboutOpenMapModal(){
    $('#modal-map').modal('show');
  }
  
  ShowSearchResults() {
    //this.ParseSearchParams();
    this.GetEvents();
    this.CloseSearchWindow();

  }

  GetImages()
  {
    this.Images = [];
    for(let item of this.Events)
    {
      this.Images[item.id] = "";
      if(item.image_id)
      {
        this.imgService.GetImageById(item.image_id)
          .subscribe((res:Base64ImageModel)=>{
            this.Images[item.id] = res.base64;
          })
      }
    }

  }

  DistanceChanged(data:any)
  {
    this.SearchParams.distance = data.from;
  }

  // CapacityChanged(data:any)
  // {
  //   if(data.from && this.SearchParams.capacity_from != data.from)
  //     this.SearchParams.capacity_from = data.from;
  //   if(data.from && this.SearchParams.capacity_to != data.from)
  //     this.SearchParams.capacity_to = data.to;
  // }

  ParseSearchParams()
  {
    let search:EventSearchParams = new EventSearchParams();
    search.limit = this.SearchParams.limit;
    search.offset = this.SearchParams.offset;
    if(this.SearchParams.text)
        search.text = this.SearchParams.text;

    if(this.SearchParams.from_date)
      search.from_date = this.SearchParams.from_date;
    
    if(this.SearchParams.to_date)
      search.to_date = this.SearchParams.to_date;

    if(this.SearchParams.distance)
      search.distance = this.SearchParams.distance;

    if(this.SearchParams.is_active)
      search.is_active = this.SearchParams.is_active;

    if(this.SearchParams.location)
      search.location = this.SearchParams.location;
    
    if(this.SearchParams.lat)
      search.lat = this.SearchParams.lat;

    if(this.SearchParams.lng)
      search.lat = this.SearchParams.lng;

    if(this.SearchParams.size)
    search.size = this.SearchParams.size;

    if(this.SearchParams.is_active)
    search.is_active = this.SearchParams.is_active;

    if(this.bsValue_start)
      search.from_date = this.bsValue_start.getFullYear()+`-`+this.incr(this.bsValue_start.getMonth())+`-`+this.bsValue_start.getDate();
    if(this.bsValue_end)
      search.to_date = this.bsValue_end.getFullYear()+`-`+this.incr(this.bsValue_end.getMonth())+`-`+this.bsValue_end.getDate();

    if(this.TicketTypes) {
      search.ticket_types = [];
      console.log("tick", search.ticket_types);
      for(let item of this.TicketTypes) {
        if(item.checked)
          search.ticket_types.push(item.value);
      }
    }

    if(this.Genres)
    {
      search.genres = [];
      for(let item of this.Genres) {
        if(item.checked)
          search.genres.push(item.genre);
      }
    }
    console.log("search", search);
  }

    aboutDragMarker($event){
      console.log($event);
      this.mapCoords.lat = $event.coords.lat;
      this.mapCoords.lng = $event.coords.lng;
      this.codeLatLng( this.mapCoords.lat, this.mapCoords.lng);
  }
  
  CreateAutocomplete(){
    this.mapsAPILoader.load().then(
        () => {
           
         let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {types:[`(cities)`]});
        
          autocomplete.addListener("place_changed", () => {
           this.ngZone.run(() => {
           let place: google.maps.places.PlaceResult = autocomplete.getPlace();  
           if(place.geometry === undefined || place.geometry === null ){
            
            return;
           }
           else {
               /* LOCATION - изменение в автокомплите autocomplete.getPlace().formatted_address */
              this.SearchParams.location = autocomplete.getPlace().formatted_address;
              this.mapCoords.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
              this.mapCoords.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
           }
          });
        });
      }
    );
    
  }


  codeLatLng(lat, lng) {
    let geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({
        'location': latlng }, 
         (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
              
                $("#searchAddress").val(results[1].formatted_address);
                
                /* LOCATION - сдвиг точки на карте results[1].formatted_address */
                this.SearchParams.location = results[1].formatted_address;
                }
            } else {
                alert('Geocoder failed due to: ' + status);
            }
        });
  }
  incr(n:number){
    return n+1;
  }
  logChanged($event){
    console.log("event",$event);
  }
}
  
