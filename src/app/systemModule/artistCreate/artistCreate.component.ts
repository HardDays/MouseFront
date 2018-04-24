import { Component, ViewChild, ElementRef, NgZone, Input, ViewContainerRef, ComponentFactory } from '@angular/core';
import { NgForm,FormControl,FormGroup,Validators, FormArray, FormArrayName} from '@angular/forms';
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
  showAllPages:boolean = false;

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
  openVideoLink:any;
  imageInfo:string = '';

  
  ImageToLoad:string = '';
  ArtistImages:{img:string,text:string}[] = [];


  preferredVenues:CheckModel<{type:string, type_show:string}>[] = []; 

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

  @ViewChild('search') public searchElement: ElementRef;



  ngOnInit(){
   
    // this.Artist.im
    this.initJS();
    this.initUser();
    this.Init()
    this.activatedRoute.params.forEach((params) => {
      if(params["id"])this.getThisArtist(+params["id"]);
    });
 
    this.getGenres();
    this.preferredVenues = this.getVenuesTypes();
    this.CreateAutocomplete();
  }

  Init(){
    this.createArtist.audio_links = [];
    this.createArtist.artist_videos = [];
    this.createArtist.artist_albums = [];
    this.createArtist.preferred_venues = [];

    this.Artist.audio_links = [];
    this.Artist.artist_albums = [];
    this.Artist.videos = [];
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
                        // this.venueSearchParams.address = autocomplete.getPlace().formatted_address;
                        // this.venueSearch();
                        // this.mapCoords.venue.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                        // this.mapCoords.venue.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                        this.createArtist.location = autocomplete.getPlace().formatted_address;
                    }
                });
            });
        }
    );
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
    
    
    
    // $('.slider-2-init').slick({
    //     dots: false,
    //     arrows: true,
    //     infinite: false,
    //     slidesToShow: 3,
    //      responsive: [
    //         {
    //           breakpoint: 1301,
    //           settings: {
    //             slidesToShow: 2,
    //             slidesToScroll: 2
               
    //           }
    //         }
    //      ]

    // });
    
    
    //  $('.slider-3-init').slick({
    //     dots: false,
    //     arrows: true,
    //     infinite: false,
    //     slidesToShow: 3,
    //      responsive: [
    //         {
    //           breakpoint: 1301,
    //           settings: {
    //             slidesToShow: 2,
    //             slidesToScroll: 2
               
    //           }
    //         }
    //      ]
         

    // });
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
                    
                    this.getUpdatedArtistById();  
                    this.showAllPages = true;                   
            }
            if(this.isNewArtist)this.router.navigate(['/system/artistCreate']);
        });  
  }

  updateArtistByCreateArtist(){
    this.accService.UpdateMyAccount(this.accountId, JSON.stringify(this.createArtist))
        .subscribe((res)=>{
                this.Artist = res;
                
                this.getAudio();
                this.getAlbumSlider();
                this.getVideosSlider();
            
                //console.log(`updated artist `,this.Artist);    
            },
            (err)=>{
                //console.log(`err`,err);
            }
    );
  }

  // get Artist && createArtist by ID
  getUpdatedArtistById(){
    this.accService.GetAccountById(this.accountId, {extended:true})
              .subscribe((user:any)=>{
                  this.Artist = user;
                  this.getAudio();
                  this.getAlbumSlider();
                  this.getVideosSlider();
                  this.updateVideosPreview();
                  this.createArtist.artist_videos = this.Artist.videos;
                 


                  //console.log(this.Artist);
                  for (let key in user) {
                      if (user.hasOwnProperty(key)) {
                          this.createArtist[key] = user[key];
                      }
                  }
                  this.genreFromModelToVar();
                  this.venueTypeFromModelToVar();
                  this.GetVenueImages();
              })

  }

  updateVideosPreview(){
    for(let video of this.Artist.videos){
      var video_id = video.link.split('v=')[1];
      var ampersandPosition = video_id.indexOf('&');
      if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
      }
      
      video.preview = 'https://img.youtube.com/vi/'+video_id+'/0.jpg';
    }
   
  }



  genreFromModelToVar(){
  for(let g of this.createArtist.genres)
      for(let gnr of this.genres)
          if(g == gnr.genre)
              gnr.checked = true;
  }
venueTypeFromModelToVar(){
  for(let t of this.createArtist.preferred_venues)
  for(let type of this.preferredVenues)
      if(t == type.object.type)
          type.checked = true;
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

           
            //console.log(`create artist`,this.createArtist);
           

            if(this.isNewArtist)

                this.accService.CreateAccount(this.createArtist)
                .subscribe((res:any)=>{
                    this.Artist = res;
                    this.getAudio();
                    this.getAlbumSlider();
                    this.getVideosSlider();
                    this.currentPage = 'riders';
                    //console.log(`new this artist`,this.Artist);
                });
           
            else this.updateArtistByCreateArtist();
        }
        else {
            //console.log(`Invalid About Form!`, this.aboutForm);
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
      this.updateArtistByCreateArtist();
    }
    else {
      //console.log(`Invalid Audio Form!`, this.aboutForm);
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
      this.updateArtistByCreateArtist();
      
    }
    else {
      //console.log(`Invalid Audio Form!`, this.aboutForm);
    }
    
  }
  getAlbumSlider(){
    setTimeout(() => {
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

      }),100
    })
  }
  
  addVideo(){
    if(!this.addVideoForm.invalid){
      let params:Video = new Video();
      for (let key in this.addVideoForm.value) {
        if (this.addVideoForm.value.hasOwnProperty(key)) {
            params[key] = this.addVideoForm.value[key];
        }
      }
      
      this.createArtist.artist_videos = this.Artist.videos;
      this.createArtist.artist_videos.push(params);
      //console.log(`!`,params,this.createArtist.artist_videos);
      // 'http://d.zaix.ru/6yut.mp3'
       this.updateArtistByCreateArtist();
    }
    else {
      //console.log(`Invalid Video Form!`, this.aboutForm);
    }
  }
  getVideosSlider(){
    setTimeout(() => {
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

      }),100
    })
  }

  openVideo(video:Video){
    var video_id = video.link.split('v=')[1];
      var ampersandPosition = video_id.indexOf('&');
      if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
      }

    this.openVideoLink = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+video_id+'?rel=0'); 
    setTimeout(()=>{$('#modal-movie').modal('show');},100);
   // console.log(video.link);
   
  }


//   addPhoto(){
//     this.accService.PostAccountImages(this.accountId,this.addImage)
//     .subscribe((res)=>{
//       //console.log(`add`,this.addImage, this.imageInfo);
//       this.updateArtistByCreateArtist();
//     }); 
//   }

//   loadPhoto($event:any):void{
//     this.ReadImages(
//         $event.target.files,
//         (res:string)=>{
//            this.addImage = res;
//         }
//     );
// }

loadImage($event:any):void{
  let target = $event.target;
  //let file:File = target.files[0];
  if(target.files.length == 0)
      return;
  
  for(let file of target.files)
  {
    let reader:FileReader = new FileReader();
    reader.onload = (e) =>{
        this.ImageToLoad = reader.result;
    }
    reader.readAsDataURL(file);
  }
 
}

DeleteImageFromLoading()
{
  this.ImageToLoad = '';
}

AddVenuePhoto()
{
  this.imgService.PostAccountImage(this.Artist.id,{image_base64:this.ImageToLoad,image_description: this.imageInfo})
    .subscribe(
      (res:any) => {
        this.ImageToLoad = '';
        this.GetVenueImages();
      }
    );
}


GetVenueImages()
{
  this.imgService.GetAccountImages(this.Artist.id,{limit:5})
    .subscribe(
      (res:any)=>{
        console.log(`images`,res)
        if(res && res.total_count > 0)
        {
          let index = 0;
          for(let img of res.images)
          {
            var txt = img.description?img.description:'';
            this.GetVenueImageById(img.id,index,txt);
            index = index + 1;
          }
        }
      }
    );
}

GetVenueImageById(id,saveIndex,text)
{
  this.imgService.GetImageById(id)
    .subscribe(
      (res:Base64ImageModel) =>{
        this.ArtistImages.push({img:res.base64,text:text});
      }
    );
   
}

SanitizeImage(image: string)
{

  return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
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

setPreferedVenue(index:number){

    if(!this.preferredVenues[index].checked){
        this.preferredVenues[index].checked = true;
      }
    else{
      this.preferredVenues[index].checked = false;
    }
}
addBooking(){

  // this.createArtist.performance_min_time = +((this.Artist.performance_min_time+'').split(' ')[0]);
  // this.createArtist.performance_max_time =  +((this.Artist.performance_max_time+'').split(' ')[0]);
  this.createArtist.performance_min_time = this.Artist.performance_min_time;
  this.createArtist.performance_max_time = this.Artist.performance_max_time;
  this.createArtist.price_from = this.Artist.price_from; 
  this.createArtist.price_to = this.Artist.price_to;
  this.createArtist.additional_hours_price = this.Artist.additional_hours_price;
  this.createArtist.is_hide_pricing_from_profile = this.Artist.is_hide_pricing_from_profile;
  this.createArtist.is_hide_pricing_from_search = this.Artist.is_hide_pricing_from_search;
  this.createArtist.is_perform_with_band = this.Artist.is_perform_with_band;
  this.createArtist.can_perform_without_band = this.Artist.can_perform_without_band;
  this.createArtist.is_perform_with_backing_vocals = this.Artist.is_perform_with_backing_vocals;
  this.createArtist.can_perform_without_backing_vocals = this.Artist.can_perform_without_backing_vocals;
 
  // this.createArtist.location = this.Artist.location;
  this.createArtist.preferred_venue_text = this.Artist.preferred_venue_text;
  this.createArtist.days_to_travel = this.Artist.days_to_travel;
  this.createArtist.is_permitted_to_stream = this.Artist.is_permitted_to_stream;
  this.createArtist.is_permitted_to_advertisement = this.Artist.is_permitted_to_advertisement;
  this.createArtist.has_conflict_contracts = this.Artist.has_conflict_contracts;
  this.createArtist.conflict_companies_names = this.Artist.conflict_companies_names;
  this.createArtist.min_time_to_book = this.Artist.min_time_to_book;
  this.createArtist.min_time_to_free_cancel = this.Artist.min_time_to_free_cancel;
  this.createArtist.late_cancellation_fee = this.Artist.late_cancellation_fee;
  this.createArtist.refund_policy = this.Artist.refund_policy;

  this.createArtist.preferred_venues = [];
  for(let type of this.preferredVenues)
    if(type.checked)
      this.createArtist.preferred_venues.push(type.object.type);

  //console.log(this.createArtist);

  this.updateArtistByCreateArtist();
}
  




}

export enum Pages {
    about = 0,
    calendar = 1,
    media = 2,
    booking = 3,
    riders = 4
}
