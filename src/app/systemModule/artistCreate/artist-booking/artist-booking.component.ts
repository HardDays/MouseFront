import { Component, OnInit, Input, NgZone, ChangeDetectorRef, ElementRef, EventEmitter, ViewChild, Output } from '@angular/core';
import { AccountCreateModel } from '../../../core/models/accountCreate.model';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { CheckModel } from '../../../core/models/check.model';

declare var $:any;

@Component({
  selector: 'app-artist-booking',
  templateUrl: './artist-booking.component.html',
  styleUrls: ['./artist-booking.component.css']
})
export class ArtistBookingComponent extends BaseComponent implements OnInit {

  // mapCoords = {lat:55.755826, lng:37.6172999};
  
  @ViewChild('search') public searchElement: ElementRef;
  
  @Output() OnSave = new EventEmitter<AccountCreateModel>();
  @Output() OnError = new EventEmitter<string>();


  @Input() Artist:AccountCreateModel;
  @ViewChild('agmMap') agmMap : AgmMap;
  preferredVenues:CheckModel<{type:string, type_show:string}>[] = []; 
  mapCoords = {lat:55.755826, lng:37.6172999};
  spaceArtistList = [];
  
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

  ngOnInit() {
    this.CreateAutocomplete();
    this.preferredVenues = this.getVenuesTypes();
  }

  Init(artist:AccountCreateModel){
    this.Artist = artist;
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

  this.Artist.preferred_venues = [];
  for(let type of this.preferredVenues)
    if(type.checked)
      this.Artist.preferred_venues.push(type.object.type);

  this.Artist.preferred_venues = [];
  for(let v of this.preferredVenues)
    if(v.checked)
      this.Artist.preferred_venues.push(v.object.type);

  console.log(this.Artist,this.preferredVenues);

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
                        this.mapCoords.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                        this.mapCoords.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                    }
                });
            });
        }
    );
  }

  
  dragMarker($event){
    //console.log($event);
    this.mapCoords.lat = $event.coords.lat;
    this.mapCoords.lng = $event.coords.lng;
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
    this.agmMap.triggerResize();
  }

  saveArtist(){
    this.OnSave.emit(this.Artist);
  }

}
