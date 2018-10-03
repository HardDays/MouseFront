import { Component, OnInit, Input, NgZone, ChangeDetectorRef, ElementRef, EventEmitter, ViewChild, Output, SimpleChanges, HostListener } from '@angular/core';
import { AccountCreateModel } from '../../../core/models/accountCreate.model';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { CheckModel } from '../../../core/models/check.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Conditional } from '@angular/compiler';
import { CurrencyIcons } from '../../../core/models/preferences.model';
import { TranslateService } from '../../../../../node_modules/@ngx-translate/core';
import { SettingsService } from '../../../core/services/settings.service';

declare var $:any;

@Component({
  selector: 'app-artist-booking',
  templateUrl: './artist-booking.component.html',
  styleUrls: ['./artist-booking.component.css'],
})
export class ArtistBookingComponent extends BaseComponent implements OnInit {

  @Input() Artist:AccountCreateModel;
  @Input() ArtistId:number;

  @Output() onSave = new EventEmitter<AccountCreateModel>();
  @Output() onSaveArtist = new EventEmitter<AccountCreateModel>();
  @Output() onSaveArtistByCircle = new EventEmitter<AccountCreateModel>();
  @Output() onSaveArtistBySave = new EventEmitter<AccountCreateModel>();


  @Output() onError = new EventEmitter<string>();

  @ViewChild('search') public searchElement: ElementRef;


  @ViewChild('agmMap') agmMap : AgmMap;

  preferredVenues:CheckModel<{type:string, type_show:string}>[] = [];
  mapCoords = {lat:55.755826, lng:37.6172999};
  spaceArtistList = [];

  type_min_time_to_free_cancel:string = '';
  type_min_time_to_book:string = '';

  CurrencySymbol = '$';

  isShowMap = false;

  ESCAPE_KEYCODE = 27;
  ENTER_KEYCODE = 13;

  isEng: boolean;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
      if(this.isShowMap){
          if (event.keyCode === this.ESCAPE_KEYCODE || event.keyCode === this.ENTER_KEYCODE) {
            $('#modal-map').modal('hide');
            this.isShowMap = false;
          }
      }
  }

  constructor(
    protected main           : MainService,
    protected _sanitizer     : DomSanitizer,
    protected router         : Router,
    protected mapsAPILoader  : MapsAPILoader,
    protected ngZone         : NgZone,
    protected activatedRoute : ActivatedRoute,
    protected cdRef          : ChangeDetectorRef,
    protected translate      :TranslateService,
    protected settings       :SettingsService
  ) {
    super(main,_sanitizer,router,mapsAPILoader,ngZone,activatedRoute,translate,settings);
  }

  ngOnInit() {
    if(this.main.settings.GetCurrency() == 'RUB'){
      this.CurrencySymbol = 'Р.';
    }
    else{
      this.CurrencySymbol = CurrencyIcons[this.main.settings.GetCurrency()];
    }


    this.isEng = this.isEnglish();
    this.CreateAutocomplete();
    // this.initDateMin();
    //this.initDateMin();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.Artist)
        this.Artist = changes.Artist.currentValue;
    if(changes.ArtistId)
        this.ArtistId = changes.ArtistId.currentValue;
    this.Init();
    this.initDateMin();
  }

  Init(){

    this.preferredVenues = this.getVenuesTypes();

    for(let v of this.preferredVenues){
      for(let venue of this.Artist.preferred_venues){
        if(v.object.type === venue['type_of_venue'])
          v.checked = true;
      }
    }

    if(!this.Artist.lat&&!this.Artist.lng)
      this.main.accService.GetLocation()
          .subscribe((data)=>{
              this.mapCoords.lat = data.location[0];
              this.mapCoords.lng = data.location[1];
              this.codeLatLng(this.mapCoords.lat,this.mapCoords.lng);
          })
    else{
      this.mapCoords.lat = this.Artist.lat;
      this.mapCoords.lng = this.Artist.lng;
    }

    // this.initDateMin();

  }

  initDateMin(){
    // console.log(`INIT DATE`)
    if(this.Artist.min_time_to_book){
      // console.log(`time`,this.Artist.min_time_to_book);
      if(this.Artist.min_time_to_book%30==0)
      {
        this.Artist.min_time_to_book = this.Artist.min_time_to_book/30;
        this.type_min_time_to_book = 'months';
      }
      else if(this.Artist.min_time_to_book%7==0)
      {
        this.Artist.min_time_to_book = this.Artist.min_time_to_book/7;
        this.type_min_time_to_book = 'weeks';
      }
      else {
        this.type_min_time_to_book = 'days';
      }
    }

    if(this.Artist.min_time_to_free_cancel){
      if(this.Artist.min_time_to_free_cancel%30==0)
      {
        this.Artist.min_time_to_free_cancel = this.Artist.min_time_to_free_cancel/30;
        this.type_min_time_to_free_cancel = 'months';
      }
      else if(this.Artist.min_time_to_free_cancel%7==0)
      {
        this.Artist.min_time_to_free_cancel = this.Artist.min_time_to_free_cancel/7;
        this.type_min_time_to_free_cancel = 'weeks';
      }
      else {
        this.type_min_time_to_free_cancel = 'days';
      }
    }

  }

  setPreferedVenue(index:number){

    if(!this.preferredVenues[index].checked){
        this.preferredVenues[index].checked = true;
      }
    else{
      this.preferredVenues[index].checked = false;
    }
  }

  addBooking(){
  // console.log(`booking save`);
  this.Artist.preferred_venues = [];

    for(let v of this.preferredVenues){
      if(v.checked)
        this.Artist.preferred_venues.push(v.object.type);
    }

    this.saveArtist();
  }

  getVenuesTypes(){
    return this.convertArrToCheckModel(
      [
        {
          type:'night_club',
          type_show:'Night Club'
        },
        {
          type:'bar',
          type_show:'Bar'
        },
        {
          type:'restaurant',
          type_show:'Restaurant'
        },
        {
          type:'concert_hall',
          type_show:'Concert Hall'
        },
        {
          type:'event_space',
          type_show:'Event Space'
        },
        {
          type:'outdoor_space',
          type_show:'Outdoor Space'
        },
        {
          type:'theatre',
          type_show:'Theatre'
        },
        {
          type:'private_residence',
          type_show:'Private Residence'
        },
        {
          type:'other',
          type_show:'Other'
        }
      ]
    );

  }

  CreateAutocomplete(){
    this.mapsAPILoader.load().then(
        () => {

         let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {types:[`(cities)`]});


            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    if(place.geometry === undefined || place.geometry === null )
                    {
                        return;
                    }
                    else
                    {
                        this.Artist.preferred_address = autocomplete.getPlace().formatted_address;
                        this.Artist.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                        this.Artist.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                        this.mapCoords.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                        this.mapCoords.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                    }
                });
            });
        }
    );
  }


  dragMarker($event){
    this.mapCoords.lat = $event.coords.lat;
    this.mapCoords.lng = $event.coords.lng;
    this.Artist.lat = $event.coords.lat;
    this.Artist.lng = $event.coords.lng;
    this.codeLatLng( this.mapCoords.lat, this.mapCoords.lng);
  }

  codeLatLng(lat, lng) {
    let geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({
        'location': latlng },
        (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {



                this.Artist.preferred_address = results[1].formatted_address;


                } else {
                // alert('No results found');
                }
            } else {
                // alert('Geocoder failed due to: ' + status);
            }
        });
  }

  openMapModal(){
    $('#modal-map').modal('show');
    this.isShowMap = true;
    setTimeout(() => {
      this.agmMap.triggerResize();
    }, 200);

  }


  preferredVenueTextInput(s:string){
    // console.log(this.preferredVenues);
    if(s.length>0){
      this.preferredVenues.find(c=>c.object.type==='other').checked = true;
    }
    else {
      this.preferredVenues.find(c=>c.object.type==='other').checked = false;
    }
  }





  saveArtist(){

    let isHasOtherVenue = this.preferredVenues.find(obj=>obj.checked&&obj.object.type==='other')?true:false;

    if(this.Artist.price_from&&this.Artist.price_to){

      if(!isHasOtherVenue||isHasOtherVenue&&this.Artist.preferred_venue_text.length>0){
        if(''+this.Artist.price_from[0]===this.CurrencySymbol)this.Artist.price_from = +(''+this.Artist.price_from).slice(1);
        if(''+this.Artist.price_to[0]===this.CurrencySymbol)this.Artist.price_to = +(''+this.Artist.price_to).slice(1);

        if(''+this.Artist.price_from[0]==='Р')this.Artist.price_from = +(''+this.Artist.price_from).slice(2);
        if(''+this.Artist.price_to[0]==='Р')this.Artist.price_to = +(''+this.Artist.price_to).slice(2);

        if(this.Artist.additional_hours_price){
          if(''+this.Artist.additional_hours_price[0]===this.CurrencySymbol)
            this.Artist.additional_hours_price = +(''+this.Artist.additional_hours_price).slice(1);
          if(''+this.Artist.additional_hours_price[0]==='Р')
            this.Artist.additional_hours_price = +(''+this.Artist.additional_hours_price).slice(2);
        }

        this.Artist.preferred_venues = [];

        for(let v of this.preferredVenues){
          if(v.checked)
            this.Artist.preferred_venues.push(v.object.type);
        }

        //this.Artist.image_base64 = null;

        if(this.type_min_time_to_book=='weeks')
          this.Artist.min_time_to_book = this.Artist.min_time_to_book*7;
        else if(this.type_min_time_to_book=='months')
          this.Artist.min_time_to_book = this.Artist.min_time_to_book*30;

        if(this.type_min_time_to_free_cancel=='weeks')
          this.Artist.min_time_to_free_cancel = this.Artist.min_time_to_free_cancel*7;
        else if(this.type_min_time_to_free_cancel=='months')
          this.Artist.min_time_to_free_cancel = this.Artist.min_time_to_free_cancel*30;

        // console.log(`to Save`,this.Artist);
        this.onSave.emit(this.Artist);

      // console.log(`ok ok okd`);
      }
      else {
        this.onError.emit('Please fill OTHER preferred venue field!');
      }
    }
    else
      this.onError.emit(this.GetTranslateString('Please fill in all required fields!'));
    return;
  }



  SaveArtistByCircle()
  {
   // this.saveArtist();

    if(this.SaveArtist())
      this.onSaveArtistByCircle.emit(this.Artist);
  }

  clickSaveButton(){
    if(this.SaveArtist())
      this.onSaveArtistBySave.emit(this.Artist);
  }

  SaveArtistAndStay(){
    if(this.SaveArtist())
      this.onSaveArtist.emit(this.Artist);
  }

  protected SaveArtist(){
     let isHasOtherVenue = this.preferredVenues.find(obj=>obj.checked&&obj.object.type==='other')?true:false;

    if(this.Artist.price_from&&this.Artist.price_to){

      if(!isHasOtherVenue||isHasOtherVenue&&this.Artist.preferred_venue_text&&this.Artist.preferred_venue_text.length>0){

        if(''+this.Artist.price_from[0]===this.CurrencySymbol)this.Artist.price_from = +(''+this.Artist.price_from).slice(1);
        if(''+this.Artist.price_to[0]===this.CurrencySymbol)this.Artist.price_to = +(''+this.Artist.price_to).slice(1);

        if(''+this.Artist.price_from[0]==='Р')this.Artist.price_from = +(''+this.Artist.price_from).slice(2);
        if(''+this.Artist.price_to[0]==='Р')this.Artist.price_to = +(''+this.Artist.price_to).slice(2);

        if(this.Artist.additional_hours_price){
          if(''+this.Artist.additional_hours_price[0]===this.CurrencySymbol)
            this.Artist.additional_hours_price = +(''+this.Artist.additional_hours_price).slice(1);
          if(''+this.Artist.additional_hours_price[0]==='Р')
            this.Artist.additional_hours_price = +(''+this.Artist.additional_hours_price).slice(2);

        }

        this.Artist.preferred_venues = [];

        for(let v of this.preferredVenues){
          if(v.checked)
            this.Artist.preferred_venues.push(v.object.type);
        }

        //this.Artist.image_base64 = null;

        if(this.type_min_time_to_book=='weeks')
          this.Artist.min_time_to_book = this.Artist.min_time_to_book*7;
        else if(this.type_min_time_to_book=='months')
          this.Artist.min_time_to_book = this.Artist.min_time_to_book*30;

        if(this.type_min_time_to_free_cancel=='weeks')
          this.Artist.min_time_to_free_cancel = this.Artist.min_time_to_free_cancel*7;
        else if(this.type_min_time_to_free_cancel=='months')
          this.Artist.min_time_to_free_cancel = this.Artist.min_time_to_free_cancel*30;

        // console.log(`to Save`,this.Artist);
        return true;
      // this.onSave.emit(this.Artist);
      } else {
        this.onError.emit(this.GetTranslateString('Please fill OTHER preferred venue field!'));
      }
    } else{
      this.onError.emit(this.GetTranslateString('Please fill in all required fields!'));
    }
    return false;
  }

}
