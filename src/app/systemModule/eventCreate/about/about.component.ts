import { Component, OnInit, NgZone, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { GenreModel } from '../../../core/models/genres.model';
import { BaseComponent } from '../../../core/base/base.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthMainService } from '../../../core/services/auth.service';
import { AccountService } from '../../../core/services/account.service';
import { ImagesService } from '../../../core/services/images.service';
import { TypeService } from '../../../core/services/type.service';
import { GenresService } from '../../../core/services/genres.service';
import { EventService } from '../../../core/services/event.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'angular2-social-login';
import { MapsAPILoader } from '@agm/core';
import { Http } from '@angular/http';
import { EventGetModel } from '../../../core/models/eventGet.model';
import { EventPatchModel } from '../../../core/models/eventPatch.model';


declare var $:any;

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent extends BaseComponent implements OnInit {

  
  @Input('event') Event:EventPatchModel = new EventPatchModel();
  @Output('submit') submit = new EventEmitter<EventPatchModel>();

  @ViewChild('searchAbout') public searchElementAbout: ElementRef;

  mapCoords =  {lat:55.755826, lng:37.6172999};
  genres:GenreModel[] = [];
  showMoreGenres:boolean = false;
  firstOpen:boolean = true;
  image:string;

  aboutForm : FormGroup = new FormGroup({        
    "name": new FormControl("", [Validators.required]),
    "tagline": new FormControl("", [Validators.required]),
    "is_crowdfunding_event": new FormControl(),
    "event_time": new FormControl("", [Validators.required]),
    "event_length": new FormControl("", [Validators.required]),
    "event_year": new FormControl("", [Validators.required]),
    "event_season": new FormControl("", [Validators.required]),
    "artists_number":new FormControl(),
    "description": new FormControl("", [Validators.required]),
    "funding_goal":new FormControl("", [Validators.pattern("[0-9]+")])
  });
 
  
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


  ngOnInit() {
      this.CreateAutocompleteAbout();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['Event']) {
        this.getGenres();
        this.InitEvent();
    }
  }

  InitEvent(){
    console.log(this.Event);
      if(this.Event.city_lat&&this.Event.city_lng){
        this.mapCoords.lat = this.Event.city_lat;
        this.mapCoords.lng = this.Event.city_lng;
      }
      
      if(this.Event.image_id)
        this.imgService.GetImageById(this.Event.image_id)
          .subscribe((img)=>{
            this.Event.image_base64 = img.base64;
      })
    
  }

  CreateAutocompleteAbout(){
    this.mapsAPILoader.load().then(
        () => {
            
          let autocomplete = new google.maps.places.Autocomplete(this.searchElementAbout.nativeElement, {types:[`(cities)`]});
        
        
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();  
                    if(place.geometry === undefined || place.geometry === null )
                    {             
                        return;
                    }
                    else 
                    {
                        this.Event.address = autocomplete.getPlace().formatted_address;
                        // this.Event.city_lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                        // this.Event.city_lng = autocomplete.getPlace().geometry.location.toJSON().lng;

                        this.mapCoords.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                        this.mapCoords.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                    }
                });
            });
        }
    );
  }

  getGenres(){
    this.genres = [];
    if(this.Event.genres)
    this.genreService.GetAllGenres()
    .subscribe((res:string[])=>{
      this.genres = this.genreService.StringArrayToGanreModelArray(res);
        for(let i of this.genres) {
          i.show = true;  
            for(let g of this.Event.genres)
              if(g==i.genre) i.checked = true;
        }
    });
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

  uploadImage($event){
    this.ReadImages(
        $event.target.files,
        (res:string)=>{
           this.Event.image_base64 = res;
            
        }
    );
  }

  aboutOpenMapModal(){
    $('#modal-map-1').modal('show');
  }

  submitEvent(){
    this.Event.genres = [];
    for(let g of this.genres)
      if(g.checked) this.Event.genres.push(g.genre);
    this.submit.emit(this.Event);
  }

  // createEventFromAbout(){
  //   if(!this.aboutForm.invalid){

  //       for (let key in this.aboutForm.value) {
  //           if (this.aboutForm.value.hasOwnProperty(key)) {
  //               this.newEvent[key] = this.aboutForm.value[key];
  //           }
  //       }

  //       this.newEvent.event_time = this.newEvent.event_time.toLowerCase();
  //       if(this.newEvent.is_crowdfunding_event==null)
  //           this.newEvent.is_crowdfunding_event = false;

        
  //       this.newEvent.genres = this.genreService.GenreModelArrToStringArr(this.genres);


  //       this.newEvent.city_lat = this.mapCoords.about.lat;
  //       this.newEvent.city_lng = this.mapCoords.about.lng;

  //       this.newEvent.account_id = this.accountId;
  //       //console.log(`newEvent`,this.newEvent);

  //       if(this.isNewEvent){
  //           console.log(`new event`)
  //           this.eventService.CreateEvent(this.newEvent)
  //           .subscribe((res)=>{
                
  //               this.Event = res;
                
  //               this.currentPage = 'artist';
  //           },
  //           (err)=>{
  //               //console.log(`err`,err);
  //           }
  //           );
  //       }
  //       else{
  //           console.log(`update event`)
  //            this.eventService.UpdateEvent(this.newEvent, this.Event.id)
  //               .subscribe((res)=>{
  //                       this.Event = res;
  //                       //console.log(`create`,this.Event);
  //                       this.currentPage = 'artist';
  //                   },
  //                   (err)=>{
  //                       //console.log(`err`,err);
  //                   }
  //           );
  //       }
  //   }
  //   else {
  //       //console.log(`Invalid About Form!`, this.aboutForm);
  //   }
  // }

}
