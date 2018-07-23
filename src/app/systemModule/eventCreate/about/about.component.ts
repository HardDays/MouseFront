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
import { EventCreateModel } from '../../../core/models/eventCreate.model';
import { EventCreateComponent } from '../eventCreate.component';
import { ViewEncapsulation } from '@angular/core';



declare var $:any;

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AboutComponent extends BaseComponent implements OnInit {


  @Input() Event:EventCreateModel;
  @Output() onSaveEvent:EventEmitter<EventCreateModel> = new EventEmitter<EventCreateModel>();
  @Output() onError:EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('searchAbout') public searchElementAbout: ElementRef;

  mapCoords =  {lat:55.755826, lng:37.6172999};

  genres:GenreModel[] = [];
  showMoreGenres:boolean = false;
  image:string;

  aboutForm : FormGroup = new FormGroup({
    "name": new FormControl("", [Validators.required]),
    "tagline": new FormControl("", [Validators.required]),
    "hashtag": new FormControl("", [Validators.required]),
    "is_crowdfunding_event": new FormControl(),
    "event_time": new FormControl("", [Validators.required]),
    "event_length": new FormControl("", [Validators.required]),
    "event_year": new FormControl("", [Validators.required]),
    "event_season": new FormControl("", [Validators.required]),
    "artists_number":new FormControl("", [Validators.required]),
    "description": new FormControl("", [Validators.required]),
    "funding_goal":new FormControl("", [Validators.pattern("[0-9]+")])
  });

  ngOnInit() {
    this.CreateAutocompleteAbout();

    var _the = this;
    $(document).mouseup(function (e) {
        var container = $("#pick-up-genre-modal");
        if (container.has(e.target).length === 0 && _the.showMoreGenres){
            _the.showMoreGenres = false;
        }
    });

    this.getGenres();

    // console.log(this.Event);
    if(this.Event.image_id)
    {
        // console.log(this.Event.image_id);
        this.main.imagesService.GetImageById(this.Event.image_id)
        .subscribe(
            (img)=>{
                // console.log(`succes`);
                this.Event.image_base64 = img.base64;
            },(err)=>{
                // console.log(`err`,err) 
            }
        )
    }
    else {
        // console.log(`NO IMAGE`);
    }

    this.mapCoords.lat = (this.Event && this.Event.city_lat)?this.Event.city_lat:55.755826;
    this.mapCoords.lng = (this.Event && this.Event.city_lng)?this.Event.city_lng:37.6172999;

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
                        this.Event.city_lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                        this.Event.city_lng = autocomplete.getPlace().geometry.location.toJSON().lng;

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
    this.main.genreService.GetAllGenres()
    .subscribe((res:string[])=>{
      this.genres = this.main.genreService.StringArrayToGenreModelArray(res);
        for(let i of this.genres) {
          i.show = true;
            if(this.Event&&this.Event.genres){
              for(let g of this.Event.genres)
                if(g==i.genre) i.checked = true;
            }
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


   dragMarker($event)
    {
        this.mapCoords.lat = $event.coords.lat;
        this.mapCoords.lng = $event.coords.lng;
        this.codeLatLng( this.mapCoords.lat, this.mapCoords.lng);
    }

    setMapCoords(event){
        this.mapCoords = {lat:event.coords.lat,lng:event.coords.lng};
        this.codeLatLng( this.mapCoords.lat, this.mapCoords.lng);
    }

    codeLatLng(lat, lng) {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode(
            {'location': latlng },
            (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[1]) {

                        $("#aboutAddress").val(results[1].formatted_address);
                        this.Event.address = results[1].formatted_address;
                        this.Event.city_lat = results[1].geometry.location.toJSON().lat;
                        this.Event.city_lng = results[1].geometry.location.toJSON().lng;

                    }
                    else {
                    // alert('No results found');
                    }
                }
                else {
                    // alert('Geocoder failed due to: ' + status);
                }
            }
        );

    }

    SaveEvent()
    {
        if(this.aboutForm.invalid)
        {
            this.onError.emit(this.getFormErrorMessage(this.aboutForm, 'event'));
            return;
        }    

        this.GetEventGenres();
        
        if(!this.Event.is_crowdfunding_event)
            this.Event.is_crowdfunding_event = false;
    
        // console.log(`thisForm`,this.Event);
        this.onSaveEvent.emit(this.Event);
    }

    GetEventGenres(){
        this.Event.genres = [];
        if(this.genres){
            for(let g of this.genres){
                if(g.checked)
                this.Event.genres.push(g.genre);
            }
        }
    }

}
