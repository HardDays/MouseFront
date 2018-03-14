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
import { ArtistAddToEventModel } from '../../core/models/artistAddToEvent.model';
import { EventGetModel } from '../../core/models/eventGet.model';
import { AccountSearchModel } from '../../core/models/accountSearch.model';



declare var $:any;
declare var ionRangeSlider:any;

@Component({
  selector: 'eventCreate',
  templateUrl: './eventCreate.component.html',
  styleUrls: ['./eventCreate.component.css']
})


export class EventCreateComponent extends BaseComponent implements OnInit {
    
    currentPage:string = 'about';
    showAllPages:boolean = false;

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

    // general
    Event:EventGetModel = new EventGetModel();
    genres:GenreModel[] = [];

    // about
    newEvent:EventCreateModel = new EventCreateModel();
    showMoreGenres:boolean = false;


    //artists

    showsArtists:AccountGetModel[] = []; // список артистов, которым отправлен запрос

    addArtist:ArtistAddToEventModel = new ArtistAddToEventModel(); // артист, которому отправляется запрос
    genresSearchArtist:GenreModel[] = []; // список жанров для поиска артистов
    searchArtist:string=''; // имя артиста для поиска
    artistsList:AccountGetModel[] = []; // артисты, которые удовлятворяют поиску
    checkArtists:number[] = []; // id чекнутых артистов, т.е. тех, которым мы отправим запрос
   
    

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
                        if(place.geometry === undefined || place.geometry === null )
                        {             
                            return;
                        }
                        else 
                        {
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
            this.addArtist.account_id = users[0].id;
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

            
            this.newEvent.genres = this.genreService.GenreModelArrToStringArr(this.genres);


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
            console.log(`Invalid About Form!`);
        }
    }


    addNewArtist(){
        this.addArtist.id = this.Event.id;

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

        this.accService.AccountsSearch(accSearch).
            subscribe((res)=>{
                this.artistsList = this.deleteDuplicateArtists(res);
                console.log(`artists`,this.artistsList);
                this.getArtistListImages();
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
  

    

}
