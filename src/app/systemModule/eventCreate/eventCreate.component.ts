import { Component, ViewChild, ElementRef, NgZone, Input, ViewContainerRef, ComponentFactory } from '@angular/core';
import { NgForm,FormControl,FormGroup,Validators, FormArray} from '@angular/forms';
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
import { Router, Params,ActivatedRoute  } from '@angular/router';
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
import { TicketModel } from '../../core/models/ticket.model';
import { TicketGetParamsModel } from '../../core/models/ticketGetParams.model';
import { GetArtists, GetVenue } from '../../core/models/eventPatch.model';
import { MessageInfoModel, InboxMessageModel } from '../../core/models/inboxMessage.model';
import { NumberSymbol } from '@angular/common';



declare var $:any;
declare var ionRangeSlider:any;

@Component({
  selector: 'eventCreate',
  templateUrl: './eventCreate.component.html',
  styleUrls: ['./eventCreate.component.css']
})




export class EventCreateComponent extends BaseComponent implements OnInit {
    
    
    // general
    /////////////////////////////////////////////////
    accountId:number = 0;
    isNewEvent:boolean = true;
    Event:EventGetModel = new EventGetModel();

    pages = Pages;
    currentPage:string = 'about';
    showAllPages:boolean = false;

    mapCoords = {
        'about': {lat:55.755826, lng:37.6172999},
        'artist': {lat:55.755826, lng:37.6172999},
        'venue': {lat:55.755826, lng:37.6172999}
    }

    genres:GenreModel[] = [];
    typesSpace:CheckModel<SelectModel>[] = [];
    
    
    // about
    /////////////////////////////////////////////////
    newEvent:EventCreateModel = new EventCreateModel();
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
        "funding_goal":new FormControl("", [Validators.required,
                                            Validators.pattern("[0-9]+")])
    });

    showMoreGenres:boolean = false;

   
    messagesList:InboxMessageModel[] = [];


    //artists
    /////////////////////////////////////////////////
    showsArtists:AccountGetModel[] = []; // список артистов, которым отправлен запрос
    isAcceptedArtistShow:boolean = true;

    addArtist:AccountAddToEventModel = new AccountAddToEventModel(); // артист, которому отправляется запрос
    artistSearchParams:AccountSearchModel = new AccountSearchModel(); // параметры поиска
    genresSearchArtist:GenreModel[] = []; // список жанров для поиска артистов
    artistsList:AccountGetModel[] = []; // артисты, которые удовлятворяют поиску
    checkArtists:number[] = []; // id чекнутых артистов, т.е. тех, которым мы отправим запрос

    ownerAcceptDecline = {
        event_id:0,
        id:0,
        message_id:0,
        account_id:0,
        datetime_from:'',
        datetime_to:''
    }

    // venue
    /////////////////////////////////////////////////

    isPrivateVenue:boolean = false;

        //public
    venueSearchParams:AccountSearchModel = new AccountSearchModel(); // параметры поиска
    venueList:AccountGetModel[] = []; //все, что удовлетворяют поиску

    isAcceptedVenueShow:boolean = true;
    venueShowsList:AccountGetModel[] = []; // чекнутые
    checkVenue:number[] = []; // список чекнутых - мб не нужно

    eventForRequest:AccountGetModel = new AccountGetModel();
    addVenue:AccountAddToEventModel = new AccountAddToEventModel(); // модель для отправление запроса

    requestVenues:AccountGetModel[] = []; // список тех, кому отправлен запрос, брать из Event
    requestVenueForm : FormGroup = new FormGroup({        
        "time_frame": new FormControl(""),
        "is_personal": new FormControl(""),
        "estimated_price": new FormControl(),
        "message": new FormControl("")
    });


        //private
    privateVenueForm : FormGroup ;
    privateVenueCreate:AccountCreateModel = new AccountCreateModel();
    privateVenue:AccountGetModel = new AccountGetModel();
    imagesListPrivateRes:string[] = [];

    /////////////////////////////////////////////////

    //funding
    activeArtist:CheckModel<GetArtists> [] = [];
    activeVenue:CheckModel<GetVenue>[] = [];
    
    artistSum:number = 0;
    venueSum:number = 0;
    additionalCosts:number = 50000;
    familyAndFriendAmount:string = '0%';


    //tickets
    tickets:TicketModel[] = [];
    ticketsNew:TicketModel[] = [];
    currentTicket:TicketModel = new TicketModel();
    isCurTicketNew:boolean = false;

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
        private ngZone: NgZone, protected h:Http,
        private activatedRoute: ActivatedRoute){
        super(authService,accService,imgService,typeService,genreService,eventService,_sanitizer,router,h,_auth);

        this.privateVenueForm = new FormGroup({        
            "user_name": new FormControl("", [Validators.required]),
            "phone": new FormControl(""),
            "capacity": new FormControl(),
            "country": new FormControl(""),
            "city": new FormControl(""),
            "address":new FormControl(),
            "description": new FormControl(""),
            "venue_video_links": new FormArray([
                new FormControl("http://")
            ]),
            "link_two": new FormControl(""),
            "has_vr": new FormControl("")
        }); 
    }

    ngOnInit()
    {    
        this.CreateAutocompleteAbout();
        this.CreateAutocompleteArtist();
        this.CreateAutocompleteVenue();
        this.initSlider();
      
       

        this.activatedRoute.params.forEach((params) => {
            //////console.log( params["id"]);
            if(params["id"])
             this.getThisEvent(+params["id"])
            else this.initUser();
        });


        this.getGenres();
        this.getAllSpaceTypes();
        
        this.artistLimitSearch();
        this.venueLimitSearch();
        
    }


    //// ########################################################################################## ////

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
    navigateTo(path:string){
      
        $('body, html').animate({
            scrollTop: $('#'+path).offset().top
        }, 800);
                
       
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

                            this.mapCoords.about.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                            this.mapCoords.about.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
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
                            this.artistSearchParams.address = autocomplete.getPlace().formatted_address;
                            this.artistSearch();
                            this.mapCoords.artist.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                            this.mapCoords.artist.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
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
                            this.venueSearchParams.address = autocomplete.getPlace().formatted_address;
                            this.venueSearch();
                            this.mapCoords.venue.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                            this.mapCoords.venue.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                        }
                    });
                });
            }
        );
    }
    aboutDragMarker($event){
        //console.log($event);
        this.mapCoords.about.lat = $event.coords.lat;
        this.mapCoords.about.lng = $event.coords.lng;
        this.codeLatLng( this.mapCoords.about.lat, this.mapCoords.about.lng, "aboutAddress");
    }
    artistDragMarker($event){
        //console.log($event);
        this.mapCoords.artist.lat = $event.coords.lat;
        this.mapCoords.artist.lng = $event.coords.lng;
        this.codeLatLng( this.mapCoords.artist.lat, this.mapCoords.artist.lng, "artistAddress");
    }
    venueDragMarker($event){
        //console.log($event);
        this.mapCoords.venue.lat = $event.coords.lat;
        this.mapCoords.venue.lng = $event.coords.lng;
        this.codeLatLng( this.mapCoords.venue.lat, this.mapCoords.venue.lng, "venueAddress");
    }
    codeLatLng(lat, lng, id_map) {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({
            'location': latlng }, 
             (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                    //   //console.log(results[1]);
                    let id = "#"+id_map;
                    $(id).val(results[1].formatted_address);
                    
                    if(id_map=='aboutAddress')
                        this.newEvent.address = results[1].formatted_address;
                    else if(id_map=='artistAddress'){
                        this.artistSearchParams.address = results[1].formatted_address;
                        this.artistSearch();
                    }
                    else if(id_map=='venueAddress'){
                        this.venueSearchParams.address = results[1].formatted_address;
                        this.venueSearch();
                    }
                        
                    } else {
                    // alert('No results found');
                    }
                } else {
                    // alert('Geocoder failed due to: ' + status);
                }
            });
    }

    addNewArtistOpenModal(){

        $('#modal-pick-artist').modal('show');
       
        // this.changeDetector.detectChanges();
    }
    sendRequestOpenModal(venue:AccountGetModel){
        $('#modal-send-request').modal('show');
        this.eventForRequest = venue;
        // this.eventForRequest.user_name
        //console.log(this.eventForRequest);
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

    //// ########################################################################################## ////

    initUser(){
        this.accService.GetMyAccount({extended:true})
        .subscribe((users:any[])=>{
            for(let u of users)
                if(u.id==+localStorage.getItem('activeUserId')){
                    this.accountId = u.id;
                    this.newEvent.account_id = this.accountId;
                    this.addArtist.account_id = this.accountId;
                    this.addVenue.account_id = this.accountId;
                    this.getMessages(this.accountId);
                }
        });
    }
       


    // general
    getGenres(){
        this.genreService.GetAllGenres()
        .subscribe((res:string[])=>{
          this.genres = this.genreService.StringArrayToGanreModelArray(res);
          for(let i of this.genres) i.show = true;
          this.genresSearchArtist = this.genreService.StringArrayToGanreModelArray(res);
          for(let i of this.genresSearchArtist) i.show = true;
        });
       
    }
    getAllSpaceTypes(){
        let types:SelectModel[] = this.typeService.GetAllSpaceTypes();
        this.typesSpace = this.convertArrToCheckModel<SelectModel>(types);
        //console.log(`spaces`,types);
        //console.log(`spaces`,this.typesSpace);
    }
    maskNumbers(){
        return {
          mask: [/[1-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/],
          keepCharPositions: true,
          guide:false
        };
    }

    getListImages(list:any[]){
        if(list)
        for(let item of list)
            if(item.image_id){
                this.imgService.GetImageById(item.image_id)
                    .subscribe((res:Base64ImageModel)=>{
                        item.image_base64_not_given = res.base64;
                });
            }
    }

    deleteDuplicateAccounts(a:AccountGetModel[]){
        for (var q=1, i=1; q<a.length; ++q) {
            if (a[q].id !== a[q-1].id) {
              a[i++] = a[q];
            }
          }
          a.length = i;
          return a;
    }

    deleteDuplicateTickets(t:TicketModel[]){
        for (var q=1, i=1; q<t.length; ++q) {
            if (t[q].id !== t[q-1].id) {
              t[i++] = t[q];
            }
          }
          t.length = i;
          return t;
    }

    // isNewAccById(mas:any[],val:any){
    //     for(let i=0;i<mas.length;i++)
    //         if(mas[i].id==val.id) return false;
    //     return true;
    // }


        isNewAccById(mas:any[],val:any){
            console.log(`isNewAccById`);
                for(let i=0;i<mas.length;i++)
                    if(mas[i].id==val.id) return false;
                return true;
    }



    
   

    //////////////////////////////////////////////////////////

    getThisEvent(id:number){
        console.log(`getThisEvent`);
        this.accService.GetMyAccount({extended:true})
        .subscribe((users:any[])=>{
            this.eventService.GetMyEvents(+localStorage.getItem('activeUserId'))
            .subscribe((res:EventGetModel[])=>{
                for(let v of res) if(v.id == id){
                        this.accountId = +localStorage.getItem('activeUserId');
                        this.newEvent.account_id = this.accountId;
                        this.addArtist.account_id = this.accountId;
                        this.addVenue.account_id = this.accountId;
                       
                        this.isNewEvent = false;
                        this.Event = v;
                        this.updateEvent();  
                        this.showAllPages = true;
                        this.getMessages(this.accountId);                  
                }
                if(this.isNewEvent)this.router.navigate(['/system/eventCreate']);
            })
        });
    }

    getMessages(id?:number){
        let crId = id?id:this.Event.creator_id;
        this.messagesList = [];
        this.accService.GetInboxMessages(crId).
        subscribe((res)=>{
            
            for(let m of res)
            this.accService.GetInboxMessageById(crId, m.id).
                subscribe((msg)=>{
                    this.messagesList.push(msg);
                    //console.log(`msg`,this.messagesList);
            }); 
        },
        (err)=>{//console.log(err)
        });
    }
    
    getPriceAtMsg(sender:number){
        for(let m of this.messagesList){
            if( m.sender_id == sender && 
                m.receiver_id == this.Event.creator_id &&
                m.message_info.event_info.id == this.Event.id){
                   return m.message_info.price;
            }
        }
    }

    getIdAtMsg(sender:number){
        for(let m of this.messagesList){
            if( m.sender_id == sender && 
                m.receiver_id == this.Event.creator_id &&
                m.message_info.event_info.id == this.Event.id){
                   return m.id;
            }
        }
    }




    updateEvent(){
        console.log(`updateEvent`);
        this.eventService.GetEventById(this.Event.id).
            subscribe((res:EventGetModel)=>{
                
                this.Event = res;
              
               
                    
                    for (let key in res) {
                        if (res.hasOwnProperty(key)) {
                            this.newEvent[key] = res[key];
                        }
                    }
                    
                // this.codeLatLng( this.newEvent.city_lat, this.newEvent.city_lng, "aboutAddress");
                // this.mapCoords.about.lat = this.newEvent.city_lat;
                // this.mapCoords.about.lng = this.newEvent.city_lng;
                // this.genreFromModelToVar();
                    

                 this.getShowsArtists();
                 this.getRequestVenue();
                 this.getTickets();
                 this.getMessages();
        });
    }

    genreFromModelToVar(){
        for(let g of  this.newEvent.genres)
            for(let gnr of this.genres)
                if(g == gnr.genre)
                    gnr.checked = true;
    }

    //////////////////////////////////////////////////////////

    

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

            
            this.newEvent.genres = this.genreService.GenreModelArrToStringArr(this.genres);


            this.newEvent.city_lat = this.mapCoords.about.lat;
            this.newEvent.city_lng = this.mapCoords.about.lng;

            this.newEvent.account_id = this.accountId;
            //console.log(`newEvent`,this.newEvent);

            if(this.isNewEvent){
                console.log(`new event`)
                this.eventService.CreateEvent(this.newEvent)
                .subscribe((res)=>{
                    this.Event = res;
                    
                    this.currentPage = 'artist';
                },
                (err)=>{
                    //console.log(`err`,err);
                }
                );
            }
            else{
                console.log(`update event`)
                 this.eventService.UpdateEvent(this.newEvent, this.Event.id)
                    .subscribe((res)=>{
                            this.Event = res;
                            //console.log(`create`,this.Event);
                            this.currentPage = 'artist';
                        },
                        (err)=>{
                            //console.log(`err`,err);
                        }
                );
            }
        }
        else {
            //console.log(`Invalid About Form!`, this.aboutForm);
        }
    }
    
    addNewArtist(){
        this.addArtist.event_id = this.Event.id;
        this.addArtist.time_frame = 'one_week';
        //console.log(`checked`,this.checkArtists);

        for(let item of this.checkArtists){
            this.addArtist.artist_id = item;
            //console.log(`new artist: `,this.addArtist);
            this.eventService.AddArtist(this.addArtist).
                subscribe((res)=>{
                    //console.log(`add artist`,item);
                    this.updateEvent();
                });
        }
        
    }

    

    getShowsArtists(){
        this.showsArtists = [];
        for(let artist of this.Event.artist){

            this.accService.GetAccountById(artist.artist_id).
                subscribe((res:AccountGetModel)=>{
                //    if(this.isNewAccById( this.showsArtists,res))
                //         {
                            this.showsArtists.push(res);
                            //console.log(`SHOW ARTISTS`, this.showsArtists);

                            if(res.image_id){
                                //console.log(`get image `, res.image_id);
                                this.imgService.GetImageById(res.image_id)
                                    .subscribe((img:Base64ImageModel)=>{
                                        res.image_base64_not_given = img.base64;
                                    },
                                    (err)=>{
                                        //console.log(`err img`,err);
                                    });
                            }
                    // }
            });
        }
    }



    getStatusArtistEventById(id:number){
        
        for(let art of this.Event.artist)
            if(art.artist_id == id) return art.status;
        
        return 'not found artist';
    }
    

   
   

    
    addArtistCheck(id){
        let index = this.checkArtists.indexOf(id);
        if (index < 0)
            this.checkArtists.push(id);
        else 
            this.checkArtists.splice(index,1);
        //console.log(this.checkArtists);
    }

    ifCheckedArtist(id){
        if(this.checkArtists.indexOf(id)<0) return false;
            else return true;
    }

   

    artistSearch($event?:string){
    
       
       if($event) this.artistSearchParams.text = $event;

       this.artistSearchParams.type = 'artist';
       this.artistSearchParams.genres = this.genreService.GenreModelArrToStringArr(this.genresSearchArtist);
   
        this.accService.AccountsSearch(this.artistSearchParams).
            subscribe((res)=>{
                if(res.length>0){
                    this.artistsList = this.deleteDuplicateAccounts(res);
                    //console.log(`artists`,this.artistsList);
                    this.getListImages(this.artistsList);
                }
        });
    }

    artistLimitSearch(){
    
        this.artistSearchParams.type = 'artist';
        this.artistSearchParams.limit = 10;
         this.accService.AccountsSearch(this.artistSearchParams).
             subscribe((res)=>{
                 if(res.length>0){
                     this.artistsList = this.deleteDuplicateAccounts(res);
                     this.getListImages(this.artistsList);
                 }
         });
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

    acceptArtist(idArtist:number){
        //console.log(idArtist);

        this.ownerAcceptDecline.account_id = this.Event.creator_id;
        this.ownerAcceptDecline.id = idArtist;
        this.ownerAcceptDecline.event_id = this.Event.id;
        this.ownerAcceptDecline.message_id = this.getIdAtMsg(idArtist);
        this.ownerAcceptDecline.datetime_from = new Date().toString();
        this.ownerAcceptDecline.datetime_to =  new Date().setFullYear( new Date().getFullYear() + 1).toString();

        this.eventService.ArtistAcceptOwner(this.ownerAcceptDecline).
            subscribe((res)=>{
                //console.log(`ok accept artist`,res);
                this.updateEvent();
            });

    }

    declineArtist(idArtist:number){

        this.ownerAcceptDecline.account_id = this.Event.creator_id;
        this.ownerAcceptDecline.id = idArtist;
        this.ownerAcceptDecline.event_id = this.Event.id;
        this.ownerAcceptDecline.message_id = 1;
        this.ownerAcceptDecline.datetime_from = new Date().toString();
        this.ownerAcceptDecline.datetime_to =  new Date().setFullYear( new Date().getFullYear() + 1).toString();

        this.eventService.ArtistDeclineOwner(this.ownerAcceptDecline).
            subscribe((res)=>{
                //console.log(`ok decline artist`,res);
                this.updateEvent();
            });

    }




    // venue

    
    venueSearch($event?:string){
        this.venueList = [];
      
        this.venueSearchParams.type = 'venue';
        if($event) this.venueSearchParams.text = $event;
        this.venueSearchParams.types_of_space = [];
        
        for(let space of this.typesSpace)
            if(space.checked) this.venueSearchParams.types_of_space.push(space.object.value)

         this.accService.AccountsSearch( this.venueSearchParams).
             subscribe((res)=>{
                 if(res.length>0){
                     this.venueList = this.deleteDuplicateAccounts(res);
                     this.getListImages(this.venueList);
                 }
         });
    }
    venueLimitSearch(){
        this.venueList = [];
      
        this.venueSearchParams.type = 'venue';
        this.venueSearchParams.limit = 10;

         this.accService.AccountsSearch( this.venueSearchParams).
             subscribe((res)=>{
                 if(res.length>0){
                     this.venueList = this.deleteDuplicateAccounts(res);
                     this.getListImages(this.venueList);
                 }
         });
    }
    VenuePriceChanged(data){
        this.venueSearchParams.price_from  = data.from;
        this.venueSearch();

    }
    VenueCapacityChanged(data){
        this.venueSearchParams.capacity_from = data.from;
        this.venueSearch();
    }


    addVenueCheck(venue:AccountGetModel){
         if(!this.ifRequestVenue(venue.id)){
            console.log(`ifRequestVenue`);
            let index = this.checkVenue.indexOf(venue.id);
            console.log(index);
            if (index < 0)
            {
                console.log(`<0`);
                this.checkVenue.push(venue.id);
                this.venueShowsList.push(venue);
            }
            else {
                console.log(`else`);
                this.checkVenue.splice(index,1);
                this.venueShowsList.splice(index,1);
            }
            //console.log(this.checkVenue);
         }
        //*this.addNewVenue();
    }

    ifCheckedVenue(id){
        if(this.checkVenue.indexOf(id)<0) return this.ifRequestVenue(id);
            else return true;
    }
    
    ifRequestVenue(id){
        for(let v of this.requestVenues)
            if(v.id==id) {
                // //console.log(`IN Request`, id);
                return true;
            }
        // //console.log(`NO in Request`, id);
        return false;
    }
    ifShowsVenue(id){
        for(let v of this.venueShowsList)
            if(v.id==id) {
                // //console.log(`IN Request`, id);
                return true;
            }
        // //console.log(`NO in Request`, id);
        return false;
    }

    
    getRequestVenue(){
        this.requestVenues = [];
        for(let venue of this.Event.venues){
            this.accService.GetAccountById(venue.venue_id).
                subscribe((res:AccountGetModel)=>{
                    if(this.isNewAccById(this.requestVenues,res)){
                            this.requestVenues.push(res);
                            let index = 0;
                            for(let sh of this.venueShowsList){
                                if(sh.id==res.id) this.venueShowsList.splice(index,1);
                                index = index + 1;
                            }
                            if(this.ifShowsVenue(res.id)){
                                console.log(`ifShowsVenue`);
                                this.addVenueCheck(res);
                            }
                            if(res.image_id){
                                this.imgService.GetImageById(res.image_id)
                                    .subscribe((img:Base64ImageModel)=>{
                                        res.image_base64_not_given = img.base64;
                                    },
                                    (err)=>{
                                        //console.log(`err img`,err);
                                    });
                            }
                     }
            });
        }
    }



    addVenueById(id:number){

            if(!this.requestVenueForm.invalid){

                for (let key in this.requestVenueForm.value) {
                    if (this.requestVenueForm.value.hasOwnProperty(key)) {
                        this.addVenue[key] = this.aboutForm.value[key];
                    }
                }
    
                this.addVenue.event_id = this.Event.id;
                this.addVenue.venue_id = id;
                
                //console.log(`add venue`,this.addVenue);
                this.eventService.AddVenue(this.addVenue).
                    subscribe((res)=>{
                        this.updateEvent();
                });
        
            }
            else {
                //console.log(`Invalid Request Form!`, this.aboutForm);
            }
    }

    getStatusVenueEventById(id:number){
        
        for(let v of this.Event.venues)
            if(v.venue_id == id) return v.status;
        
        return 'not found artist';
    }

    acceptVenue(idV:number){
        //console.log(idV);

            this.ownerAcceptDecline.account_id = this.Event.creator_id;
            this.ownerAcceptDecline.id = idV;
            this.ownerAcceptDecline.event_id = this.Event.id;
            this.ownerAcceptDecline.message_id = this.getIdAtMsg(idV);
            this.ownerAcceptDecline.datetime_from = new Date().toString();
            this.ownerAcceptDecline.datetime_to =  new Date().setFullYear( new Date().getFullYear() + 1).toString();
    
            this.eventService.VenueAcceptOwner(this.ownerAcceptDecline).
                subscribe((res)=>{
                    //console.log(`ok accept artist`,res);
                    this.updateEvent();
                });
    
            //console.log(this.ownerAcceptDecline);   
    }

    declineVenue(idV:number){
        this.ownerAcceptDecline.account_id = this.Event.creator_id;
            this.ownerAcceptDecline.id = idV;
            this.ownerAcceptDecline.event_id = this.Event.id;
            this.ownerAcceptDecline.message_id = 1;
            this.ownerAcceptDecline.datetime_from = new Date().toString();
            this.ownerAcceptDecline.datetime_to =  new Date().setFullYear( new Date().getFullYear() + 1).toString();
    
            this.eventService.VenueDeclineOwner(this.ownerAcceptDecline).
                subscribe((res)=>{
                    //console.log(`ok accept artist`,res);
                    this.updateEvent();
                });
    
            //console.log(this.ownerAcceptDecline); 
    }





    //
    addPriateVenue(){
        if(!this.privateVenueForm.invalid){


            this.addVenue.event_id = this.Event.id;
            
           
            for (let key in this.privateVenueForm.value) {
                if (this.privateVenueForm.value.hasOwnProperty(key)) {
                        this.privateVenueCreate[key] = this.privateVenueForm.value[key];
                }
            }


            if(this.privateVenueCreate.has_vr != true)
                this.privateVenueCreate.has_vr = false;

            this.privateVenueCreate.account_type = 'venue';
            this.privateVenueCreate.venue_type = 'private_residence';

          
            
            
            
            //console.log(`newPrivateEvent`,this.privateVenueCreate);

            this.accService.CreateAccount(this.privateVenueCreate)
                .subscribe((acc:AccountGetModel)=>{
                        this.privateVenue = acc;
                        //console.log(`create`,this.privateVenue);
                        for(let img of this.imagesListPrivateRes){
                           this.accService.PostAccountImages(acc.id,img)
                            .subscribe((res)=>{//console.log(`add`,img)
                        }); 
                        }
                        this.addVenue.venue_id = acc.id;
                        //console.log(`add venue`,this.addVenue);
                        this.eventService.AddVenue(this.addVenue).
                            subscribe((res)=>{
                                //console.log(`add ok`,acc);
                                this.updateEvent();
                                this.currentPage = 'funding';
                            });
                        
                    },
                    (err)=>{
                        //console.log(`err`,err);
                    }
                );
        }
        else {
            //console.log(`Invalid About Form!`, this.privateVenueForm);
        }
    }

    addPhone(){
        (<FormArray>this.privateVenueForm.controls["venue_video_links"]).push(new FormControl("http://", Validators.required));
    }
    loadPhoto($event:any):void{
        this.ReadImages(
            $event.target.files,
            (res:string)=>{
                this.imagesListPrivateRes.push(res);
                
            }
        );
    }
    getFamilyAndFriendAmount(){
        let sum =  parseFloat(this.familyAndFriendAmount)/100;
        return sum*(0.1*(this.artistSum+this.venueSum+this.additionalCosts)+(this.artistSum+this.venueSum+this.additionalCosts));
    }





    // funding
    getNumInArtistOrVenueById(id:number,list:any[]){
        if(id)
            for(let i=0; i<list.length; i++)
                if(list[i].id==id)
                    return i;          
    }
    

    
    getActiveArtVen(){

        this.artistSum = 0;
        this.venueSum = 0;
        let artist:GetArtists[] = [], venue:GetVenue[] = [];

         for(let art of this.Event.artist)
            if(art.status=='owner_accepted'){
                let num = this.getNumInArtistOrVenueById(art.artist_id,this.showsArtists);
                art.image_base64_not_given = this.showsArtists[num].image_base64_not_given;
                art.user_name_not_given =  this.showsArtists[num].user_name;

                    //заглушка на старые запросы
                    if(!art.agreement.price) art.agreement.price = 100;

                artist.push(art);
            }
        for(let v of this.Event.venues)
            if(v.status=='owner_accepted'){
                let num = this.getNumInArtistOrVenueById(v.venue_id,this.requestVenues);
                v.image_base64_not_given = this.requestVenues[num].image_base64_not_given;
                v.user_name_not_given =  this.requestVenues[num].user_name;

                //заглушка на старые запросы
                if(!v.agreement.price) v.agreement.price = 100;
                
                venue.push(v);
        }
        

        this.activeArtist = this.convertArrToCheckModel<GetArtists>(artist);
        this.activeVenue = this.convertArrToCheckModel<GetVenue>(venue);

        this.getListImages(this.activeArtist);
        this.getListImages(this.activeVenue);

        //console.log(`active: `,this.activeArtist,this.activeVenue);
    }

    setActiveArtist(index:number){
        if(!this.activeArtist[index].checked){
            this.activeArtist[index].checked = true;
            this.artistSum += this.activeArtist[index].object.agreement.price;
            this.eventService.ArtistSetActive({
                id:this.activeArtist[index].object.artist_id,
                event_id:this.Event.id,
                account_id:this.Event.creator_id
            }).
                subscribe((res)=>{
                    //console.log(`active set ok`,res);
                    this.updateEvent();
                });
        }
        else {
            this.activeArtist[index].checked = false;
            this.artistSum -= this.activeArtist[index].object.agreement.price;
            this.eventService.ArtistRemoveActive({
                id:this.activeArtist[index].object.artist_id,
                event_id:this.Event.id,
                account_id:this.Event.creator_id
            }).
                subscribe((res)=>{
                    //console.log(`active remove ok`,res);
                    this.updateEvent();
                });
        }
        //console.log(this.activeArtist);

    }

    setActiveVenue(index:number){
        if(!this.activeVenue[index].checked){
            this.activeVenue[index].checked = true;
            this.venueSum += this.activeVenue[index].object.agreement.price;
        }
        else {
            this.activeVenue[index].checked = false;
            this.venueSum -= this.activeVenue[index].object.agreement.price;
        }
        //console.log(this.activeVenue);

    }


















    // TICKETS
    getTickets(){
        console.log(`getTickets`);
        this.tickets = [];
        let params:TicketGetParamsModel = new TicketGetParamsModel();
        params.account_id = this.Event.creator_id;
        params.event_id = this.Event.id;
       
        for(let t of this.Event.tickets){
            params.id = t.id;
            this.eventService.GetTickets(params).
                subscribe((res:TicketModel)=>{
                    this.tickets.push(res);
                    this.currentTicket = this.tickets[0];
                }); 
        }
        
    }

    addTicket(){
        let newTicket:TicketModel = new TicketModel();
        newTicket.id = this.getNewId();
        newTicket.event_id = this.Event.id;
        newTicket.account_id = this.Event.creator_id;
        newTicket.name = 'New Name';
        newTicket.type = 'vr';
        newTicket.is_promotional = false;
        newTicket.is_for_personal_use = false;
        this.ticketsNew.push(newTicket);
        this.currentTicket = this.ticketsNew[this.ticketsNew.length-1];
        this.isCurTicketNew = true;
    }
    getNewId(){
        let id = 1;
        for(let t of this.ticketsNew)
            id+=t.id;
        return id;
    }

    updateTicket(){
        if(this.isCurTicketNew) {

            let index:number = -1;
            for(let i in this.ticketsNew)
                if(this.ticketsNew[i].id == this.currentTicket.id) 
                    index = +i;
            //console.log(`index`,index);

            this.currentTicket.id = null;
            //console.log(`new create`,this.currentTicket);
            this.eventService.AddTicket(this.currentTicket)
                .subscribe((res)=>{
                    //console.log(`create`,res);
                    this.isCurTicketNew = false;

                    this.ticketsNew.splice(index,1);

                    this.updateEvent();
                });

        }
        else {
            this.currentTicket.account_id = this.Event.creator_id;
            //console.log(`update old`,this.currentTicket);
            this.eventService.UpdateTicket(this.currentTicket)
                .subscribe((res)=>{
                    //console.log(`update`,res);
                    this.updateEvent();
                });
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
