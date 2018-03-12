import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
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



declare var $:any;
declare var ionRangeSlider:any;

@Component({
  selector: 'eventCreate',
  templateUrl: './eventCreate.component.html',
  styleUrls: ['./eventCreate.component.css']
})


export class EventCreateComponent extends BaseComponent implements OnInit {
    
    aboutForm : FormGroup = new FormGroup({        
        "name": new FormControl("", [Validators.required]),
        "tagline": new FormControl("", [Validators.required]),
        "is_crowdfunding_event": new FormControl(),
        "event_time": new FormControl("", [Validators.required]),
        "event_length": new FormControl("", [Validators.required]),
        "artists_number":new FormControl(),
        "description": new FormControl("", [Validators.required]),
        "funding_goal":new FormControl("", [Validators.required,
                                            Validators.pattern("[0-9]+")])
    });

    newEvent:EventCreateModel = new EventCreateModel();
    genres:GenreModel[] = [];
    showMoreGenres:boolean = false;

    @ViewChild('search') public searchElementFrom: ElementRef;

    constructor(protected authService: AuthMainService,
        protected accService:AccountService,
        protected imgService:ImagesService,
        protected typeService:TypeService,
        protected genreService:GenresService,
        protected eventService:EventService,
        protected _sanitizer: DomSanitizer,
        protected router: Router,public _auth: AuthService,
        private mapsAPILoader: MapsAPILoader, 
        private ngZone: NgZone){
        super(authService,accService,imgService,typeService,genreService,eventService,_sanitizer,router,_auth);
    }

    ngOnInit()
    {
        this.CreateAutocomplete();
        this.initSlider();
        this.getGenres();
        this.initUser();
    }

    CreateAutocomplete(){
        this.mapsAPILoader.load().then(
            () => {
               
             let autocomplete = new google.maps.places.Autocomplete(this.searchElementFrom.nativeElement, {types:[`(cities)`]});
            
              autocomplete.addListener("place_changed", () => {
               this.ngZone.run(() => {
               let place: google.maps.places.PlaceResult = autocomplete.getPlace();  
               if(place.geometry === undefined || place.geometry === null ){
                
                return;
               }
               else {
                  this.newEvent.address = autocomplete.getPlace().formatted_address;

                // this.newEvent.city_lat=autocomplete.getPlace().geometry.location.toJSON().lat;
                // this.newEvent.city_lng=autocomplete.getPlace().geometry.location.toJSON().lng;

               }
              });
              });
            }
               );
    
    
    }

    initUser(){
        this.accService.GetMyAccount({extended:true})
        .subscribe((users:any[])=>{
            this.newEvent.account_id = users[0].id;
        });
    }

    getGenres(){
        this.genreService.GetAllGenres()
        .subscribe((res:string[])=>{
          this.genres = this.genreService.StringArrayToGanreModelArray(res);
          for(let i of this.genres) i.show = true;
        });
       
    }

    initSlider(){
        var hu_2 = $(".current-slider").ionRangeSlider({
            min: 0,
            max: 100000,
            from: 20000,
            type: "single",
            hide_min_max: false,
            prefix: "$ ",
            grid: false,
            prettify_enabled: true,
            prettify_separator: ',',
            grid_num: 5,
            onChange: function () {
    
            }
        });
    
        var hu_3 = $(".current-slider-price-venue").ionRangeSlider({
            min: 0,
            max: 100000,
            from: 20000,
            type: "single",
            hide_min_max: false,
            prefix: "$ ",
            grid: false,
            prettify_enabled: true,
            prettify_separator: ',',
            grid_num: 5,
            onChange: function () {
    
            }
        });
    
        var hu_4 = $(".current-slider-capacity-venue").ionRangeSlider({
            min: 0,
            max: 100000,
            from: 10000,
            type: "single",
            hide_min_max: false,
    
            grid: false,
            prettify_enabled: true,
            prettify_separator: ',',
            grid_num: 5,
            onChange: function () {
    
            }
        });
    }
   
    addNewArtistOpenModal(){
        $('#modal-pick-artist').modal('show');
    }

    sendRequestOpenModal(){
        $('#modal-send-request').modal('show');
    }

    GengeSearch($event:string){
        var search = $event;
         if(search.length>0) {
           for(let g of this.genres)
              if(g.genre_show.indexOf(search.toUpperCase())>=0)
               g.show = true;
              else
               g.show = false;
         }
         else {
            for(let i of this.genres) i.show = true;
         }
       }

    createEventFromAbout(){
        if(!this.aboutForm.invalid){

            for (let key in this.aboutForm.value) {
                if (this.aboutForm.value.hasOwnProperty(key)) {
                    this.newEvent[key] = this.aboutForm.value[key];
                }
            }

            this.newEvent.event_time = this.newEvent.event_time.toLowerCase();
            if(this.newEvent.is_crowdfunding_event==null)
                this.newEvent.is_crowdfunding_event = false;

            
            this.newEvent.genres = [];
                for(let g of this.genres)
                    if(g.checked) this.newEvent.genres.push(g.genre);


            console.log(`newEvent`,this.newEvent);

            this.eventService.CreateEvent(this.newEvent).
                subscribe((res)=>{
                        console.log(`create`,res);
                    },
                    (err)=>{
                        console.log(`err`,err);
                    }
                );

        }
        else {
            console.log(`Invalid About Form!`);
        }
    }

    maskNumbers(){
        return {
          mask: [/[1-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/],
          keepCharPositions: true,
          guide:false
        };
      }
  

    

}
