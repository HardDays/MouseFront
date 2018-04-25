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

declare var $:any;

@Component({
  selector: 'tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})


export class TicketsComponent extends BaseComponent implements OnInit {
  Genres:GenreModel[] = [];
  ShowMoreGenres:boolean = false;
  isMarkerVisible: boolean;
  mapLng: any;
  mapLat: any;
  mapCoords = {lat:0, lng:0};
  SearchParams: TicketsSearchParams = new TicketsSearchParams();
  TypesOfSpace:SelectModel[] = [];
  TicketTypes:CheckModel<any>[] = [];
  accountId:number;
  Tickets:TicketsGetModel[] = [];
  PastTickets:TicketsGetModel[] = [];


  @ViewChild('SearchForm') form: NgForm;

  @ViewChild('searchLocal') public searchElement: ElementRef;
    LocationText:string = '';
   

  constructor(protected authService: AuthMainService,
    protected accService:AccountService,
    protected imgService:ImagesService,
    protected typeService:TypeService,
    protected genreService:GenresService,
    protected eventService:EventService,
    protected _sanitizer: DomSanitizer,
    protected router: Router,public _auth: AuthService,
    private mapsAPILoader: MapsAPILoader, 
    private ngZone: NgZone, protected h:Http,
    private activatedRoute: ActivatedRoute){
    super(authService,accService,imgService,typeService,genreService,eventService,_sanitizer,router,h,_auth);
  }




  ngOnInit(){
    this.initUser();
    this.setHeightSearch();
    this.GetGenres();
    this.openSearch();
   


  }

  initUser(){
    this.accService.GetMyAccount({extended:true})
    .subscribe((users:any[])=>{
        for(let u of users)
        if(u.id==+localStorage.getItem('activeUserId')){
          this.accountId = u.id;
          console.log(u.id);
          this.GetTickets();
          this.GetTicketsPast();
        }
    });
  }

  GetTickets()
  {
      //console.log("date", this.SearchParams);
      this.WaitBeforeLoading(
          () => this.eventService.GetAllTicketsCurrent(this.accountId,'current'),
          (res:TicketsGetModel[]) =>
          {
            console.log(res);
              this.Tickets = res;

              //this.CloseSearchWindow();
          },
          (err) => {
              console.log(err);
             // this.CloseSearchWindow();
          }
      );
  }
  GetTicketsPast()
  {
      //console.log("date", this.SearchParams);
      this.WaitBeforeLoading(
          () => this.eventService.GetAllTicketsCurrent(this.accountId,'past'),
          (res:TicketsGetModel[]) =>
          {
            console.log(res);
              this.PastTickets = res;

              //this.CloseSearchWindow();
          },
          (err) => {
              console.log(err);
             // this.CloseSearchWindow();
          }
      );
  }

  GetGenres()
  {
      this.WaitBeforeLoading(
          () => this.genreService.GetAllGenres(),
          (res:string[]) => {
              this.Genres = this.genreService.SetHiddenGenres(this.genreService.StringArrayToGanreModelArray(res));
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
  openSearch(){
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


  aboutDragMarker($event){
    //console.log($event);
    this.mapCoords.lat = $event.coords.lat;
    this.mapCoords.lng = $event.coords.lng;
    this.codeLatLng( this.mapCoords.lat, this.mapCoords.lng);
}
codeLatLng(lat, lng) {
    
    let geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(lat, lng);
    this.SearchParams.lat = lat;
    this.SearchParams.lng = lng;
    geocoder.geocode({
        'location': latlng }, 
         (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
              
                    this.LocationText = results[1].formatted_address;
                //$("#searchAddress").val(results[1].formatted_address);
                
                /* LOCATION - сдвиг точки на карте results[1].formatted_address */
                //this.SearchParams.location = results[1].formatted_address;
                }
            } else {
                alert('Geocoder failed due to: ' + status);
            }
        });
  }

  mapClick($event){
    this.mapLat = $event.coords.lat;
    this.mapLng = $event.coords.lng;
    this.isMarkerVisible = true;
    this.codeLatLng(this.mapLat,this.mapLng);
  }

  setHeightSearch(){
      //console.log($('.main-router-outlet .main-router-outlet').height(),$(window).height());
      if($('.main-router-outlet .main-router-outlet').height() < $(window).height()){
        $('.wrapp-for-filter').css({
           "height": $('.for-flex-height').height()-150
        });
        //console.log(`one`);
      }
    else{
       $('.wrapp-for-filter').css({
           "height": '100%'
        }); 
        //console.log(`two`);
    }
  }

  aboutOpenMapModal(){
      $('#modal-map').modal('show');
  }


  CreateAutocomplete(){
    this.mapsAPILoader.load().then(
        () => {
           //(this.searchElement.nativeElement, {types:[`(cities)`]})
         let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement);
        
        
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
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
                });
            });
        }
    );
  }





  
}











  
