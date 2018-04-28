import { Component, OnInit, Input, Output, ViewChild, EventEmitter, NgZone, ElementRef, SimpleChanges } from '@angular/core';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { AuthMainService } from '../../../core/services/auth.service';
import { AccountService } from '../../../core/services/account.service';
import { ImagesService } from '../../../core/services/images.service';
import { TypeService } from '../../../core/services/type.service';
import { GenresService } from '../../../core/services/genres.service';
import { EventService } from '../../../core/services/event.service';
import { BaseComponent } from '../../../core/base/base.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'angular2-social-login';
import { MapsAPILoader } from '@agm/core';
import { Http } from '@angular/http';

declare var $:any;
declare var ionRangeSlider:any;

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.css']
})
export class VenuesComponent extends BaseComponent implements OnInit {

    @Input('venues') venuesList: any[] = [];
    @Output('submit') submit = new EventEmitter<boolean>();

    @ViewChild('searchVenue') public searchElementVenue: ElementRef;

    Venues:AccountGetModel[] = [];

    mapCoords =  {lat:55.755826, lng:37.6172999};
    firstOpen:boolean = true;


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
        this.CreateAutocompleteVenue();
    }
    ngOnChanges(changes: SimpleChanges) {
   
        if (changes['venuesList']) {
          if(this.venuesList.length>0&&this.Venues.length==0){
           // this.GetArtists();
           console.log(this.venuesList);
          }
        }
      
    }

    CreateAutocompleteVenue() {
        this.mapsAPILoader.load().then(
            () => {
            
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementVenue.nativeElement, {types:[`(cities)`]});
            
            
                autocomplete.addListener("place_changed", () => {
                    this.ngZone.run(() => {
                        let place: google.maps.places.PlaceResult = autocomplete.getPlace();  
                        if(place.geometry === undefined || place.geometry === null )
                        {             
                            return;
                        }
                        else 
                        {
                            // this.venueSearchParams.address = autocomplete.getPlace().formatted_address;
                            // this.venueSearch();
                            // this.mapCoords.venue.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                            // this.mapCoords.venue.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                        }
                    });
                });
            }
        );
    }

}
