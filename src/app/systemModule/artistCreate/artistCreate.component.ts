import { Component, ViewChild, ElementRef, NgZone, Input, ViewContainerRef, ComponentFactory } from '@angular/core';
import { NgForm,FormControl,FormGroup,Validators, FormArray, FormArrayName} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';

import { BaseComponent } from '../../core/base/base.component';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

import { SelectModel } from '../../core/models/select.model';
import { FrontWorkingTimeModel } from '../../core/models/frontWorkingTime.model';
import { WorkingTimeModel } from '../../core/models/workingTime.model';
import { AccountCreateModel, Album, Video, Rider } from '../../core/models/accountCreate.model';
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
import { EventGetModel, GetArtists } from '../../core/models/eventGet.model';
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

  artistId:number;
  isNewArtist:boolean = true;

  createArtist:AccountCreateModel = new AccountCreateModel();
  


  // about
  genres:GenreModel[] = [];
  showMoreGenres:boolean = false;
  
  aboutForm : FormGroup = new FormGroup({        
    "user_name": new FormControl("", [Validators.required]),
    "display_name": new FormControl("", [Validators.required]),
    "stage_name": new FormControl(""),
    "manager_name": new FormControl(""),
    "artist_email": new FormControl(""),
    "about": new FormControl("", [Validators.required]),
    
  });
  
  //media
  addSongForm: FormGroup = new FormGroup({        
    "song_name": new FormControl("", [Validators.required]),
    "album_name": new FormControl("", [Validators.required]),
    "audio_link": new FormControl("", [Validators.required])
  });
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

  ArtistImages:{img:string,text:string,id:number}[] = [];
  imageInfo:string = '';
  ImageToLoad:string = '';

  //booking
  spaceArtistList = [];
  preferredVenues:CheckModel<{type:string, type_show:string}>[] = []; 

  //riders
  stageRider:Rider= new Rider();
  backstageRider:Rider= new Rider();
  hospitalityRider:Rider= new Rider();
  technicalRider:Rider= new Rider();
  

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

    this.Init();

    this.initUser(()=>{
      this.activatedRoute.params.forEach((params) => {
        if(params["id"])
          this.getThisArtist(+params["id"]);
      });
    });
 
  }

  Init(){
    this.createArtist.audio_links = [];
    this.createArtist.artist_videos = [];
    this.createArtist.artist_albums = [];
    this.createArtist.preferred_venues = [];
    this.createArtist.artist_riders = [];

    this.preferredVenues = this.getVenuesTypes();
    this.getGenres();
    this.CreateAutocomplete();
    this.initJS();
  }

  initJS(){
    
    setTimeout(() => {
      var as = audiojs.createAll();
     }, 200);
     

    //  $('.slider-3-init').slick({
    //   dots: false,
    //   arrows: true,
    //   infinite: false,
    //   slidesToShow: 3,
    //    responsive: [
    //       {
    //         breakpoint: 1301,
    //         settings: {
    //           slidesToShow: 2,
    //           slidesToScroll: 2
             
    //         }
    //       }
    //    ]

    //   });
     
   
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
    // $('.slider-4-init').slick({
    //     dots: false,
    //     arrows: true,
    //     infinite: false,
    //     slidesToShow: 2,
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
                        this.createArtist.preferred_address = autocomplete.getPlace().formatted_address;
                    }
                });
            });
        }
    );
  }


  initUser(callback?:(params?)=>any){
    this.accService.GetMyAccount({extended:true})
    .subscribe((users:any[])=>{
        for(let u of users)
        if(u.id==+localStorage.getItem('activeUserId')){
          this.artistId = u.id;
          callback();
        }
    });
  }


  getThisArtist(id:number){
    if(this.artistId == id){     
        this.isNewArtist = false;
        this.getUpdatedArtistById();                
      }
  }



  // get Artist && createArtist by ID
  getUpdatedArtistById(){
    // console.log(`GET ARTIST`);
    this.accService.GetAccountById(this.artistId, {extended:true})
              .subscribe((artist:AccountGetModel)=>{
                

                  this.artistModelToCreateArtistModel(artist);
                  
                  // this.createArtist.preferred_venues = [];
                  // for (let key of this.Artist.preferred_venues) {
                  //       this.createArtist.preferred_venues.push(key.type_of_venue);
                  // }
                  
                  this.spaceArtistList = artist.preferred_venues;
                  this.venueTypeFromModelToVar();
                  this.genreFromModelToVar();
                  this.GetVenueImages();

               
                  // this.initJS();
                  this.updateVideosPreview();
              })

  }

  artistModelToCreateArtistModel(artist:AccountGetModel){
    for (let key in artist) {
      if (artist.hasOwnProperty(key)) {
          this.createArtist[key] = artist[key];
      }
    }
    this.createArtist.artist_videos = artist.videos; 
  }

  updateArtistByCreateArtist(){
    // console.log(`UPGRADE`,this.createArtist);
    
    this.accService.UpdateMyAccount(this.artistId, JSON.stringify(this.createArtist))
        .subscribe((res:AccountGetModel)=>{
                this.createArtist.audio_links = [];
                this.createArtist.audio_links = res.audio_links;
                
                this.spaceArtistList = res.preferred_venues;  
                
                this.venueTypeFromModelToVar();

                this.updateVideosPreview();
                this.GetVenueImages();
            
                this.currentPage = this.currentPage!='riders'?this.pages[this.pages[this.currentPage]+1]:'riders';

                this.clearNewElements();

                this.initJS();
                
            },
            (err)=>{
                console.log(`err`,err);
            }
    );
  }


  genreFromModelToVar(){
    for(let g of this.createArtist.genres)
      for(let gnr of this.genres)
          if(g == gnr.genre)
              gnr.checked = true;
  }
  
  venueTypeFromModelToVar(){
   
    this.createArtist.preferred_venues = [];

    for (let key of this.spaceArtistList) {
          this.createArtist.preferred_venues.push(key.type_of_venue);
    }
    
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



  artistFromAbout(){
        if(!this.aboutForm.invalid){

            for (let key in this.aboutForm.value) {
                if (this.aboutForm.value.hasOwnProperty(key)) {
                    this.createArtist[key] = this.aboutForm.value[key];
                }
            }

            this.createArtist.account_type = AccountType.Artist;
            this.createArtist.genres = this.genreService.GenreModelArrToStringArr(this.genres);
            
           
            console.log(`Artist from About`,this.createArtist);
          
            if(this.isNewArtist){
                console.log(`CREATE NEW ARTIST`);
                this.accService.CreateAccount(this.createArtist)
                .subscribe((artist:AccountGetModel)=>{
                    this.artistId = artist.id;
                    this.artistModelToCreateArtistModel(artist);
                    this.currentPage = 'calendar';
                });
            }
           
            else this.updateArtistByCreateArtist();
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
      

      this.updateArtistByCreateArtist();
    }
    else {
      //console.log(`Invalid Audio Form!`, this.aboutForm);
    }
    
  }

  deleteAudio(index:number){
    this.createArtist.audio_links.splice(index,1);
    this.updateArtistByCreateArtist();
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

  deleteAlbum(index:number){
    this.createArtist.artist_albums.splice(index,1);
    this.updateArtistByCreateArtist();
  }
  

  addVideo(){
    if(!this.addVideoForm.invalid){
      let params:Video = new Video();
      for (let key in this.addVideoForm.value) {
        if (this.addVideoForm.value.hasOwnProperty(key)) {
            params[key] = this.addVideoForm.value[key];
        }
      }
      // this.createArtist.artist_videos = this.createArtist.videos;
      this.createArtist.artist_videos.push(params);
      // 'http://d.zaix.ru/6yut.mp3'
      console.log(`videos list before update`,this.createArtist.artist_videos);
       this.updateArtistByCreateArtist();
       this.updateVideosPreview();
    }
    else {
      
    }
  }

  deleteVideo(index:number){
    this.createArtist.artist_videos.splice(index,1);
    this.updateVideosPreview();
    this.updateArtistByCreateArtist();
  }

  updateVideosPreview(){
    console.log(`update VIDEO Images`);
    for(let video of this.createArtist.artist_videos){
      var video_id = video.link.split('v=')[1];
      var ampersandPosition = video_id.indexOf('&');
      if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
      }
      video.preview = 'https://img.youtube.com/vi/'+video_id+'/0.jpg';
    }
  }
  openVideo(video:Video){
    var video_id = video.link.split('v=')[1];
      var ampersandPosition = video_id.indexOf('&');
      if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
      }

    this.openVideoLink = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+video_id+'?rel=0'); 
    setTimeout(()=>{$('#modal-movie').modal('show');},100);
 
    
  }






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
  // console.log(`image`,this.ImageToLoad)
  this.imgService.PostAccountImage(this.artistId,{image_base64:this.ImageToLoad,image_description: this.imageInfo})
    .subscribe(
      (res:any) => {
        this.ImageToLoad = '';
        this.imageInfo = '';
        this.GetVenueImages();
      }
    );
}


GetVenueImages()
{
  this.imgService.GetAccountImages(this.artistId,{limit:5})
    .subscribe(
      (res:any)=>{
        
        if(res && res.total_count > 0)
        {
          this.ArtistImages = [];
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
        this.ArtistImages.push({img:res.base64,text:text,id:res.id});
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

  this.createArtist.preferred_venues = [];
  for(let type of this.preferredVenues)
    if(type.checked)
      this.createArtist.preferred_venues.push(type.object.type);

  console.log(this.createArtist,this.preferredVenues);

  this.updateArtistByCreateArtist();
}






loadRiderFile($event:any){
  let target = $event.target;
  let file:File = target.files[0];
  
  for(let file of target.files)
  {
    let reader:FileReader = new FileReader();
    reader.onload = (e) =>{
      this.stageRider.uploaded_file_base64 = reader.result;
    }
    reader.readAsDataURL(file);
  }
 
}


  confirmStageRider(){

    this.stageRider.rider_type = 'stage';

    if(!this.stageRider.is_flexible)
      this.stageRider.is_flexible = false;
    this.createArtist.artist_riders.push(this.stageRider);
    
    this.updateArtistByCreateArtist();
  }

  confirmTechnicalRider(){

    this.technicalRider.rider_type = 'technical';

    if(!this.technicalRider.is_flexible)
      this.technicalRider.is_flexible = false;
    this.createArtist.artist_riders.push(this.technicalRider);
    
    this.updateArtistByCreateArtist();
  }
  loadTechnicalRiderFile($event:any){
    let target = $event.target;
    let file:File = target.files[0];
    
    for(let file of target.files)
    {
      let reader:FileReader = new FileReader();
      reader.onload = (e) =>{
        this.technicalRider.uploaded_file_base64 = reader.result;
      }
      reader.readAsDataURL(file);
    }
   
  }

  confirmBackstageRider(){

    this.backstageRider.rider_type = 'backstage';

    if(!this.backstageRider.is_flexible)
    this.backstageRider.is_flexible = false;
   
    this.createArtist.artist_riders.push(this.backstageRider);
    
    this.updateArtistByCreateArtist();
  }
  loadBackstageRiderFile($event:any){
    let target = $event.target;
    let file:File = target.files[0];
    
    for(let file of target.files)
    {
      let reader:FileReader = new FileReader();
      reader.onload = (e) =>{
        this.backstageRider.uploaded_file_base64 = reader.result;
      }
      reader.readAsDataURL(file);
    }
   
  }

  confirmHospitalityRider(){

    this.hospitalityRider.rider_type = 'hospitality';

    if(!this.hospitalityRider.is_flexible)
    this.hospitalityRider.is_flexible = false;
    
    this.createArtist.artist_riders.push(this.hospitalityRider);
    
    this.updateArtistByCreateArtist();
  }
  loadHospitalityRiderFile($event:any){
    let target = $event.target;
    let file:File = target.files[0];
    
    for(let file of target.files)
    {
      let reader:FileReader = new FileReader();
      reader.onload = (e) =>{
        this.hospitalityRider.uploaded_file_base64 = reader.result;
      }
      reader.readAsDataURL(file);
    }
   
  }


  clearNewElements(){

    this.addSongForm.reset();
    this.addAlbumForm.reset();
    this.addVideoForm.reset();

  }

  deleteImage(id:number){
    this.imgService.DeleteImageById(id,this.artistId)
      .subscribe((res)=>{
        // console.log(res);
        this.GetVenueImages();
      },(err)=>{
        console.log(`err`,err);
      })
  }


}

export enum Pages {
    about = 0,
    calendar = 1,
    media = 2,
    booking = 3,
    riders = 4
}
