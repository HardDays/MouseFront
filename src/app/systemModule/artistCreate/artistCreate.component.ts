import { Component, ViewChild, ElementRef, NgZone, Input, ViewContainerRef, ComponentFactory } from '@angular/core';
import { NgForm,FormControl,FormGroup,Validators} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';

import { BaseComponent } from '../../core/base/base.component';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

import { SelectModel } from '../../core/models/select.model';
import { FrontWorkingTimeModel } from '../../core/models/frontWorkingTime.model';
import { WorkingTimeModel } from '../../core/models/workingTime.model';
import { AccountCreateModel, Album, Video } from '../../core/models/accountCreate.model';
import { EventDateModel } from '../../core/models/eventDate.model';
import { ContactModel } from '../../core/models/contact.model';
import { AccountGetModel, Audio } from '../../core/models/accountGet.model';
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
import { Router, Params, ActivatedRoute } from '@angular/router';
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
declare var audiojs:any;
declare var ionRangeSlider:any;

@Component({
  selector: 'artistCreate',
  templateUrl: './artistCreate.component.html',
  styleUrls: ['./artistCreate.component.css']
})




export class ArtistCreateComponent extends BaseComponent implements OnInit {
  
  // general
  pages = Pages;
  currentPage:string = 'about';
  showAllPages:boolean = true;

  accountId:number;
  isNewArtist:boolean = true;
  Artist:AccountGetModel = new AccountGetModel();
  createArtist:AccountCreateModel = new AccountCreateModel();
  
  
  
 

  // about
  
  aboutForm : FormGroup = new FormGroup({        
    "user_name": new FormControl("", [Validators.required]),
    "display_name": new FormControl("", [Validators.required]),
    "stage_name": new FormControl("", [Validators.required]),
    "manager_name": new FormControl("", [Validators.required]),
    "email": new FormControl(""),
    "about": new FormControl("", [Validators.required]),
    
  });
  genres:GenreModel[] = [];
  showMoreGenres:boolean = false;

  addSongForm: FormGroup = new FormGroup({        
    "song_name": new FormControl("", [Validators.required]),
    "album_name": new FormControl("", [Validators.required]),
    "audio_link": new FormControl("", [Validators.required])
  });
  updateAudio:boolean = false;
  addAlbumForm: FormGroup = new FormGroup({        
    "album_artwork": new FormControl("", [Validators.required]),
    "album_name": new FormControl("", [Validators.required]),
    "album_link": new FormControl("", [Validators.required])
  });
  addVideoForm: FormGroup = new FormGroup({        
    "album_name": new FormControl("", [Validators.required]),
    "name": new FormControl("", [Validators.required]),
    "link": new FormControl("", [Validators.required])
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


  ngOnInit(){
    this.createArtist.audio_links = [];
    this.createArtist.artist_videos = [];
    this.createArtist.artist_albums = [];
    // this.Artist.im
    this.initJS();
    this.initUser();
    this.Init()
    this.activatedRoute.params.forEach((params) => {
      if(params["id"])this.getThisArtist(+params["id"]);
  });
 
    this.getGenres();
  }

  Init(){
    this.Artist.audio_links = [];
  }
  initJS(){
   
     var as = audiojs.createAll();
   
    //слайдер аудио, в слайде 12 песен
    // $('.slider-audio-wrapp').slick({
    //     dots: false,
    //     arrows: true,
    //     infinite: false,
    //     slidesToShow: 1

    // });
    
    
    
    $('.slider-2-init').slick({
        dots: false,
        arrows: true,
        infinite: false,
        slidesToShow: 3,
         responsive: [
            {
              breakpoint: 1301,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
               
              }
            }
         ]

    });
    
    
     $('.slider-3-init').slick({
        dots: false,
        arrows: true,
        infinite: false,
        slidesToShow: 3,
         responsive: [
            {
              breakpoint: 1301,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
               
              }
            }
         ]
         

    });
    $('.slider-4-init').slick({
        dots: false,
        arrows: true,
        infinite: false,
        slidesToShow: 2,
         responsive: [
            {
              breakpoint: 1301,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
               
              }
            }
         ]

    });
  }
  initUser(){
    this.accService.GetMyAccount({extended:true})
    .subscribe((users:any[])=>{
        for(let u of users)
        if(u.id==+localStorage.getItem('activeUserId')){
          this.accountId = u.id;
        }
    });
  }

  getThisArtist(id:number){
        
    this.accService.GetMyAccount({extended:true})
    .subscribe((users:any[])=>{
            for(let art of users) if(art.id == id){
                    this.accountId = art.id;
                    this.isNewArtist = false;
                    
                    this.getUpdatedArtist();  
                    this.showAllPages = true;                   
            }
            if(this.isNewArtist)this.router.navigate(['/system/artistCreate']);
        });  
  }

  updateArtist(){
    this.accService.UpdateMyAccount(this.accountId, JSON.stringify(this.createArtist))
        .subscribe((res)=>{
                this.Artist = res;
                // var as = audiojs.createAll();
                // if(this.updateAudio){
                this.getAudio();
                  // this.updateAudio=false;
                // }
                this.currentPage = 'calendar';
                console.log(`updated artist `,this.Artist);
            },
            (err)=>{
                console.log(`err`,err);
            }
    );
  }
  getUpdatedArtist(){

  
  this.accService.GetAccountById(this.accountId, {extended:true})
            .subscribe((user:any)=>{
                this.Artist = user;
                this.getAudio();
                console.log(this.Artist);
                for (let key in user) {
                    if (user.hasOwnProperty(key)) {
                        this.createArtist[key] = user[key];
                    }
                }
                // var as = audiojs.createAll();
                this.genreFromModelToVar();
  })

  }
  genreFromModelToVar(){
  for(let g of  this.createArtist.genres)
      for(let gnr of this.genres)
          if(g == gnr.genre)
              gnr.checked = true;
}

  //about form
  getGenres(){
    this.genreService.GetAllGenres()
    .subscribe((res:string[])=>{
      this.genres = this.genreService.StringArrayToGanreModelArray(res);
      for(let i of this.genres) i.show = true;
      // this.genresSearchArtist = this.genreService.StringArrayToGanreModelArray(res);
      // for(let i of this.genresSearchArtist) i.show = true;
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

  createEventFromAbout(){
        if(!this.aboutForm.invalid){

            for (let key in this.aboutForm.value) {
                if (this.aboutForm.value.hasOwnProperty(key)) {
                    this.createArtist[key] = this.aboutForm.value[key];
                }
            }
            this.createArtist.account_type = AccountType.Artist;
          
            this.createArtist.genres = this.genreService.GenreModelArrToStringArr(this.genres);

           
            console.log(`create artist`,this.createArtist);
           

            if(this.isNewArtist)

                this.accService.CreateAccount(this.createArtist)
                .subscribe((res:any)=>{
                    this.Artist = res;
                    this.getAudio();
                    this.currentPage = 'calendar';
                    console.log(`new this artist`,this.Artist);
                });
           
            else this.updateArtist();
        }
        else {
            console.log(`Invalid About Form!`, this.aboutForm);
        }
  }

  
  addAudio(){
    if(!this.addSongForm.invalid){
      let params:Audio = new Audio();
      for (let key in this.addSongForm.value) {
        if (this.addSongForm.value.hasOwnProperty(key)) {
            params[key] = this.addSongForm.value[key];
        }
      }
      this.createArtist.audio_links.push(params);
      // 'http://d.zaix.ru/6yut.mp3'
      this.updateAudio = true;
      this.updateArtist();
    }
    else {
      console.log(`Invalid Audio Form!`, this.aboutForm);
    }
    
  }
  getAudio(){
    setTimeout(() => {
      var as2 = audiojs.createAll();
      if(this.Artist.audio_links.length>12)
       $('.slider-audio-wrapp').slick({
        dots: false,
        arrows: true,
        infinite: false,
        slidesToShow: 1

    });
    }, 100);    
  }



  addAlbum(){
    if(!this.addAlbumForm.invalid){
      let params:Album = new Album();
      for (let key in this.addAlbumForm.value) {
        if (this.addAlbumForm.value.hasOwnProperty(key)) {
            params[key] = this.addAlbumForm.value[key];
        }
      }
      this.createArtist.artist_albums.push(params);
      // 'http://d.zaix.ru/6yut.mp3'
      this.updateArtist();
    }
    else {
      console.log(`Invalid Audio Form!`, this.aboutForm);
    }
    
  }
  addVideo(){
    if(!this.addVideoForm.invalid){
      let params:Video = new Video();
      for (let key in this.addVideoForm.value) {
        if (this.addVideoForm.value.hasOwnProperty(key)) {
            params[key] = this.addVideoForm.value[key];
        }
      }
      console.log(`!`,params,this.createArtist.artist_videos);
      this.createArtist.artist_videos.push(params);
      // 'http://d.zaix.ru/6yut.mp3'
       this.updateArtist();
    }
    else {
      console.log(`Invalid Video Form!`, this.aboutForm);
    }
  }
  addPhoto(){

  }

  




}

export enum Pages {
    about = 0,
    calendar = 1,
    media = 2,
    booking = 3,
    riders = 4
}
