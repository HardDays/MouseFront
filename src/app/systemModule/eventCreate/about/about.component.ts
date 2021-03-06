import { BaseMessages, EventStatus } from './../../../core/base/base.enum';
import { Component, OnInit, NgZone, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChanges, HostListener } from '@angular/core';
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
import { CurrencyIcons } from '../../../core/models/preferences.model';
import { BsDatepickerConfig, BsDaterangepickerDirective, BsDaterangepickerConfig, BsLocaleService } from '../../../../../node_modules/ngx-bootstrap';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ruLocale } from 'ngx-bootstrap/locale';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
defineLocale('ru', ruLocale);



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
  private _picker: BsDatepickerDirective;
  CurrencySymbol = '$';
  eventStatus = EventStatus;
  IsApprovedEvent = false;
  Time = '00:00';

  // ExactDate = new Date();

  aboutForm : FormGroup = new FormGroup({
    "name": new FormControl({value: "", disabled: this.IsApprovedEvent}, [Validators.required]),
    "tagline": new FormControl("", [Validators.required]),
    "hashtag": new FormControl("", [Validators.required]),
    "is_crowdfunding_event": new FormControl(),
    "comments_available": new FormControl(),
    "event_time": new FormControl("", [Validators.required]),
    "event_length": new FormControl("", [Validators.required]),
    "event_year": new FormControl("", [Validators.required]),
    "event_season": new FormControl("", [Validators.required]),
    "artists_number":new FormControl("", [Validators.required]),
    "description": new FormControl("", [Validators.required]),
    "funding_goal":new FormControl("", [Validators.pattern("[0-9]+")]),
    "currency": new FormControl("", [Validators.required]),
  });

  isShowMap = false;

  ESCAPE_KEYCODE = 27;
  ENTER_KEYCODE = 13;

  @ViewChild('dp') datepicker: BsDaterangepickerDirective;

  localeService: BsLocaleService;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
      if(this.isShowMap){
          if (event.keyCode === this.ESCAPE_KEYCODE || event.keyCode === this.ENTER_KEYCODE) {
            $('#modal-map-1').modal('hide');
            this.isShowMap = false;
          }
      }
  }

    bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
        containerClass: 'theme-default',
        rangeInputFormat: this.main.settings.GetDateFormat(),
        locale: this.settings.GetLang(),
        showWeekNumbers:false
    });

    datepickerFromModel:Date = new Date();
    datepickerToModel:Date = new Date();
    datepickerExactModel:Date = new Date();

    minDate = new Date();
    maxDate = new Date();

    minDateFrom = new Date();
    minDateTo = this.minDateFrom;

  ngOnInit() {

    this.CreateAutocompleteAbout();



    var _the = this;
    // $(document).mouseup(function (e) {
    //     var container = $("#pick-up-genre-modal");
    //     if (container.has(e.target).length === 0 && _the.showMoreGenres){
    //         _the.showMoreGenres = false;
    //     }
    // });

    this.getGenres();
    this.GetCurrentCurrency();

    if(this.Event.is_crowdfunding_event){
        this.setDate();
    }

    if(this.Event){
      if(this.Event.exact_date_from){

        // this.datepickerExactModel = new Date(this.Event.exact_date_from);
        this.datepickerExactModel = new Date( this.main.typeService.DateToUTCDateISOString(this.Event.exact_date_from));
        this.Time = this.Event.exact_date_from.split('T')[1];
      }
      else if(this.Event.date_from){
        this.datepickerExactModel = new Date( this.main.typeService.DateToUTCDateISOString(this.Event.exact_date_from));
        // this.datepickerExactModel = new Date(this.Event.date_from);
      }
      if(this.Event.date_from&&this.Event.date_to){
        this.minDate = new Date(this.Event.date_from);
        this.maxDate = new Date(this.Event.date_to);
      }
    }
    // this.Event&&this.Event.date_from?this.datepickerExactModel = new Date(this.Event.date_from):null;

    if(this.Event.image_id)
    {
        this.main.imagesService.GetImageById(this.Event.image_id)
        .subscribe(
            (img)=>{
                this.Event.image_base64 = img.base64;
            },(err)=>{
            }
        )
    }
    else {
    }

    this.mapCoords.lat = (this.Event && this.Event.city_lat)?this.Event.city_lat:55.755826;
    this.mapCoords.lng = (this.Event && this.Event.city_lng)?this.Event.city_lng:37.6172999;

    if(!this.Event.city_lat&&!this.Event.city_lng)
      this.main.accService.GetLocation()
        .subscribe((data)=>{
            this.mapCoords.lat = data.location[0];
            this.mapCoords.lng = data.location[1];
        })

    this.IsApprovedEvent = this.Event.status===this.eventStatus.Approved||this.Event.status===this.eventStatus.Active?true:false;
    // this.aboutForm.updateValueAndValidity();
    if(this.IsApprovedEvent){
      this.aboutForm.controls['name'].disable();
      this.aboutForm.controls['tagline'].disable();
      this.aboutForm.controls['hashtag'].disable();
      this.aboutForm.controls['is_crowdfunding_event'].disable();
      this.aboutForm.controls['comments_available'].disable();
      this.aboutForm.controls['event_time'].disable();
      this.aboutForm.controls['event_length'].disable();
      this.aboutForm.controls['event_year'].disable();
      this.aboutForm.controls['event_season'].disable();
      this.aboutForm.controls['artists_number'].disable();
      this.aboutForm.controls['funding_goal'].disable();
      this.aboutForm.controls['currency'].disable();
      this.aboutForm.controls['name'].disable();
    }

    // cnsole.log(this.Event);

  }
ShowHideGenres(event){
    event.stopPropagation();
    this.showMoreGenres = !this.showMoreGenres
}
HideGenresIfShowed(){
    if(this.showMoreGenres){
        this.showMoreGenres = false;
    }
}
onShowPicker(event) {
    const dayHoverHandler = event.dayHoverHandler;
    const hoverWrapper = (hoverEvent) => {
        const { cell, isHovered } = hoverEvent;

        if ((isHovered &&
          !!navigator.platform &&
          /iPad|iPhone|iPod/.test(navigator.platform)) &&
          'ontouchstart' in window
        ) {
            (this._picker as any)._datepickerRef.instance.daySelectHandler(cell);
        }

        return dayHoverHandler(hoverEvent);
    };
    event.dayHoverHandler = hoverWrapper;
}
GetCurrentCurrency(){
    if(!this.Event.currency){
         this.Event.currency = this.main.settings.GetCurrency();
    }


    this.CurrencySymbol = CurrencyIcons[this.Event.currency];


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
          if(g.genre_show.indexOf(search.toLowerCase())>=0)
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
    this.isShowMap = true;
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
        else{
            this.Event.funding_from = this.datepickerFromModel.toString();
            this.Event.funding_to = this.datepickerToModel.toString();
        }


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

    setDate(){
        this.datepickerToModel = new Date(this.Event.funding_to);
        this.datepickerFromModel = new Date(this.Event.funding_from);
    }
    TimeChange($event){
      this.Time = $event;
    }

    SetExactDate(){
      let date = this.main.typeService.DateToUTCDateISOString(new Date(this.datepickerExactModel.getTime() - this.datepickerExactModel.getTimezoneOffset() * 60000));
    
      // let exactDate = new Date(date+this.Time);

      this.main.eventService.SetEventDateById(this.Event.id, date+" "+this.Time, this.CurrentAccount.id)
        .subscribe(
          (res)=>
          {
            this.Event.exact_date_from = this.main.typeService.DateToUTCDateISOString(this.datepickerExactModel);
            this.onError.emit(BaseMessages.Success);
          },
          (err)=>{
            this.onError.emit(BaseMessages.Fail)
          }
        )
    }

}
