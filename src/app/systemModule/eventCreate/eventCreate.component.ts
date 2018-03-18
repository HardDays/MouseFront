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



declare var $:any;
declare var ionRangeSlider:any;

@Component({
  selector: 'eventCreate',
  templateUrl: './eventCreate.component.html',
  styleUrls: ['./eventCreate.component.css']
})




export class EventCreateComponent extends BaseComponent implements OnInit {
    
    pages = Pages;
    currentPage:string = 'about';
    showAllPages:boolean = true;

    
   

    // general
    /////////////////////////////////////////////////

    Event:EventGetModel = new EventGetModel();
    

    // about
    /////////////////////////////////////////////////
    
    newEvent:EventCreateModel = new EventCreateModel();
    showMoreGenres:boolean = false;
    aboutMapCoords = {lat:0, lng:0};
    genres:GenreModel[] = [];
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
    


    //artists
    /////////////////////////////////////////////////

    showsArtists:AccountGetModel[] = []; // список артистов, которым отправлен запрос

    addArtist:AccountAddToEventModel = new AccountAddToEventModel(); // артист, которому отправляется запрос
    genresSearchArtist:GenreModel[] = []; // список жанров для поиска артистов
    searchArtist:string=''; // имя артиста для поиска
    searchArtistAddress:string = '';
    artistsList:AccountGetModel[] = []; // артисты, которые удовлятворяют поиску
    checkArtists:number[] = []; // id чекнутых артистов, т.е. тех, которым мы отправим запрос
   
    artistMapCoords = {lat:0, lng:0};



    // venue
    /////////////////////////////////////////////////

    isPrivateVenue:boolean = false;
    venueMapCoords = {lat:0, lng:0};

    searchVenue:string='';
    searchVenueAddress:string='';
    venueList:AccountGetModel[] = [];
    typesSpace:CheckModel[] = [];
    
    venuePrice:number = 20000;
    venueCapacity:number = 10000;
    checkVenue:number[] = [];
    addVenue:AccountAddToEventModel = new AccountAddToEventModel();
    showsVenues:AccountGetModel[] = [];

    privateVenueForm : FormGroup = new FormGroup({        
        "user_name": new FormControl("", [Validators.required]),
        "phone": new FormControl(""),
        "capacity": new FormControl(),
        "country": new FormControl(""),
        "city": new FormControl(""),
        "address":new FormControl(),
        "description": new FormControl(""),
        "link_one": new FormControl(""),
        "link_two": new FormControl(""),
        "has_vr": new FormControl("")
    });
    privateVenueAcc:AccountCreateModel = new AccountCreateModel();
    privateVenue:AccountGetModel = new AccountGetModel();

    /////////////////////////////////////////////////

    @ViewChild('searchAbout') public searchElementAbout: ElementRef;
    @ViewChild('searchArtist') public searchElementArtist: ElementRef;
    @ViewChild('searchVenue') public searchElementVenue: ElementRef;


    constructor(protected authService: AuthMainService,
        protected accService:AccountService,
        protected imgService:ImagesService,
        protected typeService:TypeService,
        protected genreService:GenresService,
        protected eventService:EventService,
        protected _sanitizer: DomSanitizer,
        protected router: Router,public _auth: AuthService,
        private mapsAPILoader: MapsAPILoader, 
        private ngZone: NgZone, protected h:Http){
        super(authService,accService,imgService,typeService,genreService,eventService,_sanitizer,router,h,_auth);
            // this.contentFactory = this.cfr.resolveComponentFactory(DynComponent);
    }

    ngOnInit()
    {    
       
        this.CreateAutocompleteAbout();
        this.CreateAutocompleteArtist();
        this.CreateAutocompleteVenue();
        this.initSlider();
        this.getGenres();
        this.initUser();

        this.getAllSpaceTypes();
        this.artistSearch();
        this.venueSearch();
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
                            this.newEvent.address = autocomplete.getPlace().formatted_address;

                            this.aboutMapCoords.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                            this.aboutMapCoords.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                        }
                    });
                });
            }
        );
    }
    CreateAutocompleteArtist(){
        this.mapsAPILoader.load().then(
            () => {
              
             let autocomplete = new google.maps.places.Autocomplete(this.searchElementArtist.nativeElement, {types:[`(cities)`]});
            
            
                autocomplete.addListener("place_changed", () => {
                    this.ngZone.run(() => {
                        let place: google.maps.places.PlaceResult = autocomplete.getPlace();  
                        if(place.geometry === undefined || place.geometry === null )
                        {             
                            return;
                        }
                        else 
                        {
                            this.searchArtistAddress = autocomplete.getPlace().formatted_address;
                            this.artistSearch();
                            this.artistMapCoords.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                            this.artistMapCoords.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                        }
                    });
                });
            }
        );
    }
    CreateAutocompleteVenue(){
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
                            this.searchVenueAddress = autocomplete.getPlace().formatted_address;
                            this.venueSearch();
                            this.venueMapCoords.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                            this.venueMapCoords.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                        }
                    });
                });
            }
        );
    }

    codeLatLng(lat, lng, id_map) {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({
            'location': latlng }, 
             (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                    //   console.log(results[1]);
                    let id = "#"+id_map;
                    $(id).val(results[1].formatted_address);
                    
                    if(id_map=='aboutAddress')
                        this.newEvent.address = results[1].formatted_address;
                    else if(id_map=='artistAddress'){
                        this.searchArtistAddress = results[1].formatted_address;
                        this.artistSearch();
                    }
                    else if(id_map=='venueAddress'){
                        this.searchVenueAddress = results[1].formatted_address;
                        this.venueSearch();
                    }
                        
                    } else {
                    alert('No results found');
                    }
                } else {
                    alert('Geocoder failed due to: ' + status);
                }
            });
    }

    initUser(){
        this.accService.GetMyAccount({extended:true})
        .subscribe((users:any[])=>{
            this.newEvent.account_id = users[0].id;
            this.addArtist.account_id = users[0].id;
            this.addVenue.account_id = users[0].id;
        });
    }

    getGenres(){
        this.genreService.GetAllGenres()
        .subscribe((res:string[])=>{
          this.genres = this.genreService.StringArrayToGanreModelArray(res);
          for(let i of this.genres) i.show = true;
          this.genresSearchArtist = this.genreService.StringArrayToGanreModelArray(res);
          for(let i of this.genresSearchArtist) i.show = true;
        });
       
    }

    initSlider(){
        
        let _the = this;

        var hu_2 = $(".current-slider").ionRangeSlider({
            min: 0,
            max: 100000,
            from: 20000,
            step: 10,
            type: "single",
            hide_min_max: false,
            prefix: "$ ",
            grid: false,
            prettify_enabled: true,
            prettify_separator: ',',
            grid_num: 5,
            onChange: function (data) {
                _the.PriceArtistChanged(data);
            }
        });

        this.addArtist.estimated_price = 20000;
    
        var hu_3 = $(".current-slider-price-venue").ionRangeSlider({
            min: 0,
            max: 100000,
            from: 20000,
            step: 5,
            type: "single",
            hide_min_max: false,
            prefix: "$ ",
            grid: false,
            prettify_enabled: true,
            prettify_separator: ',',
            grid_num: 5,
            onChange: function (data) {
                _the.VenuePriceChanged(data);
            }
        });
    
        var hu_4 = $(".current-slider-capacity-venue").ionRangeSlider({
            min: 0,
            max: 100000,
            from: 10000,
            step: 10,
            type: "single",
            hide_min_max: false,
    
            grid: false,
            prettify_enabled: true,
            prettify_separator: ',',
            grid_num: 5,
            onChange: function (data) {
                _the.VenueCapacityChanged(data);
            }
        });

    }
   
    addNewArtistOpenModal(){

        $('#modal-pick-artist').modal('show');
       
        // this.changeDetector.detectChanges();
    }

    sendRequestOpenModal(){
        $('#modal-send-request').modal('show');
    }

    aboutOpenMapModal(){
        $('#modal-map-1').modal('show');
    }

    artistOpenMapModal(){
        $('#modal-map-2').modal('show');
        this.artistSearch();
    }

    venueOpenMapModal(){
        $('#modal-map-3').modal('show');
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

    aboutDragMarker($event){
        console.log($event);
        this.aboutMapCoords.lat = $event.coords.lat;
        this.aboutMapCoords.lng = $event.coords.lng;
        this.codeLatLng( this.aboutMapCoords.lat, this.aboutMapCoords.lng, "aboutAddress");
    }

    artistDragMarker($event){
        console.log($event);
        this.artistMapCoords.lat = $event.coords.lat;
        this.artistMapCoords.lng = $event.coords.lng;
        this.codeLatLng( this.artistMapCoords.lat, this.artistMapCoords.lng, "artistAddress");
    }

    venueDragMarker($event){
        console.log($event);
        this.venueMapCoords.lat = $event.coords.lat;
        this.venueMapCoords.lng = $event.coords.lng;
        this.codeLatLng( this.venueMapCoords.lat, this.venueMapCoords.lng, "venueAddress");
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

            
            this.newEvent.genres = this.genreService.GenreModelArrToStringArr(this.genres);


            this.newEvent.city_lat = this.aboutMapCoords.lat;
            this.newEvent.city_lng = this.aboutMapCoords.lng;

            
            console.log(`newEvent`,this.newEvent);

            this.eventService.CreateEvent(this.newEvent)
                .subscribe((res)=>{
                        this.Event = res;
                        console.log(`create`,this.Event);
                        this.currentPage = 'artist';
                    },
                    (err)=>{
                        console.log(`err`,err);
                    }
                );
        }
        else {
            console.log(`Invalid About Form!`, this.aboutForm);
        }
    }
    
    addNewArtist(){
        this.addArtist.event_id = this.Event.id;

        console.log(`new artist: `,this.addArtist);
        console.log(`checked`,this.checkArtists);

        for(let item of this.checkArtists){
            this.addArtist.artist_id = item;
            this.eventService.AddArtist(this.addArtist).
                subscribe((res)=>{
                    console.log(`add artist`,item);
                    this.updateEvent();
                });
        }
        
    }

    updateEvent(){
        this.eventService.GetEventById(this.Event.id).
            subscribe((res:EventGetModel)=>{
                this.Event = res;
                
                this.getShowsArtists();
                this.getShowsVenue();
        });
    }

    getShowsArtists(){
        this.showsArtists = [];
        for(let artist of this.Event.artist){

            this.accService.GetAccountById(artist.artist_id).
                subscribe((res:AccountGetModel)=>{
                   if(this.isNewArtist( this.showsArtists,res))
                        {
                            this.showsArtists.push(res);
                            console.log(`SHOW ARTISTS`, this.showsArtists);

                            if(res.image_id){
                                console.log(`get image `, res.image_id);
                                this.imgService.GetImageById(res.image_id)
                                    .subscribe((img:Base64ImageModel)=>{
                                        res.image_base64_not_given = img.base64;
                                    },
                                    (err)=>{
                                        console.log(`err img`,err);
                                    });
                            }
                    }
            });
        }
    }



    getStatusArtistEventById(id:number){
        
        for(let art of this.Event.artist)
            if(art.artist_id == id) return art.status;
        
        return 'not found artist';
    }

    getShowsArtistsImages(){
        for(let item of this.showsArtists)
            if(item.image_id){
                this.imgService.GetImageById(item.image_id)
                    .subscribe((res:Base64ImageModel)=>{
                        item.image_base64_not_given = res.base64;
                });
            }
    }

    isNewArtist(mas:any[],val:any){
        for(let i=0;i<mas.length;i++)
            if(mas[i].id==val.id) return false;
        return true;
    }

    
    addArtistCheck(id){
        let index = this.checkArtists.indexOf(id);
        if (index < 0)
            this.checkArtists.push(id);
        else 
            this.checkArtists.splice(index,1);
        console.log(this.checkArtists);
    }

    ifCheckedArtist(id){
        if(this.checkArtists.indexOf(id)<0) return false;
            else return true;
    }

    maskNumbers(){
        return {
          mask: [/[1-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/],
          keepCharPositions: true,
          guide:false
        };
    }


    artistSearch($event?:string){
       if($event) this.searchArtist = $event;
        
       var accSearch:AccountSearchModel = new AccountSearchModel();
       accSearch.type = 'artist';
       accSearch.text = this.searchArtist;
       accSearch.genres = this.genreService.GenreModelArrToStringArr(this.genresSearchArtist);
       accSearch.address = this.searchArtistAddress;
        this.accService.AccountsSearch(accSearch).
            subscribe((res)=>{
                if(res.length>0){
                    this.artistsList = this.deleteDuplicateArtists(res);
                    console.log(`artists`,this.artistsList);
                    this.getArtistListImages();
                }
        });
    }

    deleteDuplicateArtists(a:AccountGetModel[]){
        for (var q=1, i=1; q<a.length; ++q) {
            if (a[q].id !== a[q-1].id) {
              a[i++] = a[q];
            }
          }
        
          a.length = i;
          return a;
    }

    getArtistListImages(){
        for(let item of this.artistsList)
            if(item.image_id){
                this.imgService.GetImageById(item.image_id)
                    .subscribe((res:Base64ImageModel)=>{
                        item.image_base64_not_given = res.base64;
                });
            }
    }


    PriceArtistChanged(data:any){
        this.addArtist.estimated_price = data.from;
    }

    sliceName(text:string){
        if(text)
            if(text.length<15) return text;
            else return text.slice(0,14)+'...';
    }
    sliceGenres(mas:string[]){
        if(mas)
            if(mas.length<4)return mas;
            else return mas.slice(0,3)+'...';
    }

    toBeatyShowsList( mas:any[]){
        let list: string = '';
        for(let item of mas)
            list+= item.toUpperCase()+", ";
        let answer = '';
        for(let i=0;i<list.length-2;i++)
            if(list[i]!="_") answer += list[i];
            else answer += " ";
        return answer;
    }




    // venue

    getAllSpaceTypes(){
        let types:SelectModel[] = this.typeService.GetAllSpaceTypes();
         this.typesSpace = this.convertArrToCheckModel(types);
        console.log(`spaces`,types);
        console.log(`spaces`,this.typesSpace);
    }

    venueSearch($event?:string){
        this.venueList = [];
        if($event) this.searchVenue = $event;
         
        var venueSearch:AccountSearchModel = new AccountSearchModel();
        
        venueSearch.type = 'venue';
        venueSearch.text = this.searchVenue;
        venueSearch.type_of_space = [];
        venueSearch.capacity_from = this.venueCapacity;
        venueSearch.price_from = this.venuePrice;
        venueSearch.address = this.searchVenueAddress;

        for(let space of this.typesSpace)
            if(space.checked) venueSearch.type_of_space.push(space.object.value)

        
         this.accService.AccountsSearch(venueSearch).
             subscribe((res)=>{
                 if(res.length>0){
                     this.venueList = this.deleteDuplicateArtists(res);
                     console.log(`venue`,venueSearch,this.venueList);
                     this.getVenueListImages();
                 }
         });
    }

    getVenueListImages(){
        for(let item of this.venueList)
            if(item.image_id){
                this.imgService.GetImageById(item.image_id)
                    .subscribe((res:Base64ImageModel)=>{
                        item.image_base64_not_given = res.base64;
                });
            }
    }
  
    VenuePriceChanged(data){
        this.venuePrice = data.from;
        this.venueSearch();

    }

    VenueCapacityChanged(data){
        this.venueCapacity = data.from;
        this.venueSearch();
    }

    addVenueCheck(id){
        let index = this.checkVenue.indexOf(id);
        if (index < 0)
            this.checkVenue.push(id);
        else 
            this.checkVenue.splice(index,1);
        console.log(this.checkVenue);

        this.addNewVenue();
    }

    addNewVenue(){
        this.addVenue.event_id = this.Event.id;

        for(let item of this.checkVenue){
            this.addVenue.venue_id = item;
            console.log(`add venue`,this.addVenue);
            this.eventService.AddVenue(this.addVenue).
                subscribe((res)=>{
                    console.log(`add ok`,item);
                    this.updateEvent();
                });
        }
        
    }

    ifCheckedVenue(id){
        if(this.checkVenue.indexOf(id)<0) return false;
            else return true;
    }

    getShowsVenue(){
        this.showsVenues = [];
        for(let venue of this.Event.venue){

            this.accService.GetAccountById(venue.venue_id).
                subscribe((res:AccountGetModel)=>{
                   if(this.isNewArtist( this.showsVenues,res))
                        {
                            this.showsVenues.push(res);
                            console.log(`SHOW Venues`, this.showsVenues);

                            if(res.image_id){
                                console.log(`get image `, res.image_id);
                                this.imgService.GetImageById(res.image_id)
                                    .subscribe((img:Base64ImageModel)=>{
                                        res.image_base64_not_given = img.base64;
                                    },
                                    (err)=>{
                                        console.log(`err img`,err);
                                    });
                            }
                    }
            });
        }
    }

    getStatusVenueEventById(id:number){
        
        for(let v of this.Event.venue)
            if(v.venue_id == id) return v.status;
        
        return 'not found artist';
    }

    getShowsVenuesImages(){
        for(let item of this.showsVenues)
            if(item.image_id){
                this.imgService.GetImageById(item.image_id)
                    .subscribe((res:Base64ImageModel)=>{
                        item.image_base64_not_given = res.base64;
                });
            }
    }

    addPriateVenue(){
        if(!this.privateVenueForm.invalid){


            this.addVenue.event_id = this.Event.id;
            
           
            for (let key in this.privateVenueForm.value) {
                if (this.privateVenueForm.value.hasOwnProperty(key)) {
                        this.privateVenueAcc[key] = this.privateVenueForm.value[key];
                }
            }


            if(this.privateVenueAcc.has_vr != true)
                this.privateVenueAcc.has_vr = false;

            this.privateVenueAcc.account_type = 'venue';

            this.privateVenueAcc.video_links = [];
            if(this.privateVenueForm.value['link_one'])
                this.privateVenueAcc.video_links.push(this.privateVenueForm.value['link_one']);
            if(this.privateVenueForm.value['link_two'])
                this.privateVenueAcc.video_links.push(this.privateVenueForm.value['link_two']);
            
            
            console.log(`newPrivateEvent`,this.privateVenueAcc);

            this.accService.CreateAccount(this.privateVenueAcc)
                .subscribe((acc:AccountGetModel)=>{
                        this.privateVenue = acc;
                        console.log(`create`,this.privateVenue);

                        this.addVenue.venue_id = acc.id;
                        console.log(`add venue`,this.addVenue);
                        this.eventService.AddVenue(this.addVenue).
                            subscribe((res)=>{
                                console.log(`add ok`,acc);
                                this.updateEvent();
                                this.currentPage = 'funding';
                            });
                        
                    },
                    (err)=>{
                        console.log(`err`,err);
                    }
                );
        }
        else {
            console.log(`Invalid About Form!`, this.privateVenueForm);
        }
    }


    

}

export enum Pages {
    about = 0,
    artist = 1,
    venue = 2,
    funding = 3,
    tickets = 4
}
