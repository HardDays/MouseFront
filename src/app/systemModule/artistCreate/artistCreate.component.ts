import { Component, ViewChild, ElementRef, NgZone, Input, ViewContainerRef, ComponentFactory, ChangeDetectorRef } from '@angular/core';
import { NgForm,FormControl,FormGroup,Validators, FormArray, FormArrayName} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';

import { BaseComponent } from '../../core/base/base.component';
import { OnInit, AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';

import { SelectModel } from '../../core/models/select.model';
import { FrontWorkingTimeModel } from '../../core/models/frontWorkingTime.model';
import { WorkingTimeModel } from '../../core/models/workingTime.model';
import { AccountCreateModel, Album, Video, Rider } from '../../core/models/accountCreate.model';
import { EventDateModel } from '../../core/models/eventDate.model';
import { ContactModel } from '../../core/models/contact.model';
import { AccountGetModel, Audio } from '../../core/models/accountGet.model';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { AccountType, BaseMessages } from '../../core/base/base.enum';
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


import { MainService } from '../../core/services/main.service';
import { ErrorComponent } from '../../shared/error/error.component';
import { ArtistAboutComponent } from './artist-about/artist-about.component';
import { ArtistMediaComponent } from './artist-media/artist-media.component';
import { ArtistBookingComponent } from './artist-booking/artist-booking.component';
import { ArtistRidersComponent } from './artist-riders/artist-riders.component';


declare var $:any;
declare var audiojs:any;
declare var ionRangeSlider:any;

@Component({
  selector: 'artistCreate',
  templateUrl: './artistCreate.component.html',
  styleUrls: ['./artistCreate.component.css']
})




export class ArtistCreateComponent extends BaseComponent implements OnInit,AfterViewChecked {

  // general

  pages = Pages;
  currentPage = Pages.about;
  showAllPages:boolean = false;

  
  isNewArtist:boolean = true;
  Artist:AccountCreateModel = new AccountCreateModel();
  ArtistId:number;

  

  @ViewChild('errorCmp') errorCmp: ErrorComponent;
  @ViewChild('AboutPage') AboutPage: ArtistAboutComponent;
  @ViewChild('MediaPage') MediaPage: ArtistMediaComponent;
  @ViewChild('BookingPage') BookingPage: ArtistBookingComponent;
  @ViewChild('RidersPage') RidersPage: ArtistRidersComponent;

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

  ngAfterViewChecked()
  {
      this.cdRef.detectChanges();
  }

  ngOnInit()
  {
    this.activatedRoute.params.forEach(
      (params) => {
        if(params["id"] == 'new')
        {
          this.DisplayArtistParams(null);
        }
        else
        {
          this.WaitBeforeLoading(
            () => this.main.accService.GetAccountById(params["id"]),
            (res:AccountGetModel) => {
              this.DisplayArtistParams(res);
            }, (err)=>{
              this.errorCmp.OpenWindow(BaseMessages.Fail);
            }
          );
        }
      }
    );
  }


  DisplayArtistParams($artist?:AccountGetModel)
  {
    this.Artist = $artist ? this.main.accService.AccountGetModelToCreateAccountModel($artist) : new AccountCreateModel();
    if($artist&&$artist.id)
    {
      this.ArtistId = $artist.id;
      this.router.navigateByUrl("/system/artistCreate/"+this.ArtistId);
    }

    if(this.AboutPage)
      this.AboutPage.Init(this.Artist);
    if(this.MediaPage)
      this.MediaPage.Init(this.Artist);
    if(this.BookingPage)
      this.BookingPage.Init(this.Artist);
    if(this.RidersPage)
      this.RidersPage.Init(this.Artist);
  }

  SaveArtist(artist:AccountCreateModel)
  {
    this.WaitBeforeLoading
    (
      () => this.ArtistId == 0 ? this.main.accService.CreateAccount(this.Artist) : this.main.accService.UpdateMyAccount(this.ArtistId,this.Artist),
      (res) => {
        this.DisplayArtistParams(res);
        this.NextPart();
      },
      (err) => {
        this.errorCmp.OpenWindow(BaseMessages.Fail);
      }
    )
  }



  //saveButtonClick(){
    //console.log(`saveButtonClick`,this.currentPage);
    // if(this.currentPage == this.pages.about)
    //   this.about.SaveEvent();
    // else if(this.currentPage == this.pages.artist)
    //   this.artist.artistComplete();
    // else if(this.currentPage == this.pages.venue)
    //   this.venue.submitVenue();
    // else if(this.currentPage == this.pages.funding)
    //   this.funding.comleteFunding();
    // else if(this.currentPage == this.pages.tickets)
    //     this.tickets.updateEvent();
  //}


  // ngOnInit(){

  //   this.Init();

  //   this.initUser(()=>{
  //     this.activatedRoute.params.forEach((params) => {
  //       if(params["id"])
  //         this.getThisArtist(+params["id"]);
  //     });
  //   });
 
   

//   Init(){
//     this.Artist.audio_links = [];
//     this.Artist.artist_videos = [];
//     this.Artist.artist_albums = [];
//     this.Artist.preferred_venues = [];
//     this.Artist.artist_riders = [];

//     this.preferredVenues = this.getVenuesTypes();
    
//     this.initJS();
//   }

//   initJS(){
    
//     setTimeout(() => {
//       var as = audiojs.createAll();
//      }, 200);
     

//     //  $('.slider-3-init').slick({
//     //   dots: false,
//     //   arrows: true,
//     //   infinite: false,
//     //   slidesToShow: 3,
//     //    responsive: [
//     //       {
//     //         breakpoint: 1301,
//     //         settings: {
//     //           slidesToShow: 2,
//     //           slidesToScroll: 2
             
//     //         }
//     //       }
//     //    ]

//     //   });
     
   
//     //слайдер аудио, в слайде 12 песен
//     // $('.slider-audio-wrapp').slick({
//     //     dots: false,
//     //     arrows: true,
//     //     infinite: false,
//     //     slidesToShow: 1

//     // });
    
    
    
//     // $('.slider-2-init').slick({
//     //     dots: false,
//     //     arrows: true,
//     //     infinite: false,
//     //     slidesToShow: 3,
//     //      responsive: [
//     //         {
//     //           breakpoint: 1301,
//     //           settings: {
//     //             slidesToShow: 2,
//     //             slidesToScroll: 2
               
//     //           }
//     //         }
//     //      ]

//     // });
    
    
//     //  $('.slider-3-init').slick({
//     //     dots: false,
//     //     arrows: true,
//     //     infinite: false,
//     //     slidesToShow: 3,
//     //      responsive: [
//     //         {
//     //           breakpoint: 1301,
//     //           settings: {
//     //             slidesToShow: 2,
//     //             slidesToScroll: 2
               
//     //           }
//     //         }
//     //      ]
         

//     // });
//     // $('.slider-4-init').slick({
//     //     dots: false,
//     //     arrows: true,
//     //     infinite: false,
//     //     slidesToShow: 2,
//     //      responsive: [
//     //         {
//     //           breakpoint: 1301,
//     //           settings: {
//     //             slidesToShow: 2,
//     //             slidesToScroll: 2
               
//     //           }
//     //         }
//     //      ]

//     // });
//   }



//   initUser(callback?:(params?)=>any){
//     this.main.accService.GetMyAccount({extended:true})
//     .subscribe((users:any[])=>{
//         for(let u of users)
//         if(u.id==+localStorage.getItem('activeUserId')){
//           this.ArtistId = u.id;
//           callback();
//         }
//     });
//   }


//   getThisArtist(id:number){
        
//     this.main.accService.GetMyAccount({extended:true})
//     .subscribe((users:any[])=>{
//             for(let art of users) if(art.id == id){
//                     // this.accountId = art.id;
//                     this.isNewArtist = false;
                    
//                     this.getUpdatedArtistById();  
//                     // this.showAllPages = true;                   
//             }
//             if(this.isNewArtist)
//               this.router.navigate(['/system/artistCreate']);
//         });  
//   }

 

//   // get Artist && createArtist by ID
//   getUpdatedArtistById(){
//     this.main.accService.GetAccountById(this.CurrentAccount.id, {extended:true})
//               .subscribe((user:any)=>{
//                   this.Artist = user;

//                   this.createArtist.artist_videos = this.Artist.videos;
                 

//                   //console.log(this.Artist);
//                   for (let key in user) {
//                       if (user.hasOwnProperty(key)) {
//                           this.createArtist[key] = user[key];
//                       }
//                   }

//                   this.artistModelToCreateArtistModel(user);
                  
//                   // this.createArtist.preferred_venues = [];
//                   // for (let key of this.Artist.preferred_venues) {
//                   //       this.createArtist.preferred_venues.push(key.type_of_venue);
//                   // }
                  
//                   this.spaceArtistList = user.preferred_venues;
//                   this.venueTypeFromModelToVar();
//                   this.genreFromModelToVar();
//                   this.GetVenueImages();

                  
//                   this.initJS();
//                   this.updateVideosPreview();
//                   this.getRiders();
//               })

//   }

//   artistModelToCreateArtistModel(artist:AccountGetModel){
//     for (let key in artist) {
//       if (artist.hasOwnProperty(key)) {
//           this.createArtist[key] = artist[key];
//       }
//     }
//     this.createArtist.artist_videos = artist.videos; 
//   }

//   updateArtistByCreateArtist(){
//     // console.log(`UPGRADE`,this.createArtist);
    
//     this.main.accService.UpdateMyAccount(this.artistId, JSON.stringify(this.createArtist))
//         .subscribe((res:AccountGetModel)=>{
//                 this.createArtist.audio_links = [];
//                 this.createArtist.audio_links = res.audio_links;
                
//                 this.spaceArtistList = res.preferred_venues;  
                
//                 this.venueTypeFromModelToVar();

//                 this.updateVideosPreview();
//                 this.GetVenueImages();
            
//                 this.NextPart();

//                 this.clearNewElements();

//                 this.initJS();
//                 this.main.GetMyAccounts();
//                 this.getRiders();
//                 this.errorCmp.OpenWindow(BaseMessages.Success);
//             },
//             (err)=>{
//                // console.log(`err`,err);
//                 this.errorCmp.OpenWindow(BaseMessages.Fail);
//             }
//     );
//   }


//   genreFromModelToVar(){
//     for(let g of this.createArtist.genres)
//       for(let gnr of this.genres)
//           if(g == gnr.genre)
//               gnr.checked = true;
//   }
  
//   venueTypeFromModelToVar(){
   
//     this.createArtist.preferred_venues = [];

//     for (let key of this.spaceArtistList) {
//           this.createArtist.preferred_venues.push(key.type_of_venue);
//     }
    
//     for(let t of this.createArtist.preferred_venues)
//     for(let type of this.preferredVenues)
//         if(t == type.object.type)
//             type.checked = true;
//   }

//   //about form
 





  
//   addAudio(){
//     if(!this.addSongForm.invalid){
//       let params:Audio = new Audio();
//       for (let key in this.addSongForm.value) {
//         if (this.addSongForm.value.hasOwnProperty(key)) {
//             params[key] = this.addSongForm.value[key];
//         }
//       }
//       this.createArtist.audio_links.push(params);
//       // 'http://d.zaix.ru/6yut.mp3'
      

//       this.updateArtistByCreateArtist();
//     }
//     else {
//       //console.log(`Invalid Audio Form!`, this.aboutForm);
//     }
    
//   }

//   deleteAudio(index:number){
//     this.createArtist.audio_links.splice(index,1);
//     this.updateArtistByCreateArtist();
//   }


//   addAlbum(){
//     if(!this.addAlbumForm.invalid){
//       let params:Album = new Album();
//       for (let key in this.addAlbumForm.value) {
//         if (this.addAlbumForm.value.hasOwnProperty(key)) {
//             params[key] = this.addAlbumForm.value[key];
//         }
//       }
//       this.createArtist.artist_albums.push(params);
//       // 'http://d.zaix.ru/6yut.mp3'
//       this.updateArtistByCreateArtist();
      
//     }
//     else {
//       //console.log(`Invalid Audio Form!`, this.aboutForm);
//     }
    
//   }

//   deleteAlbum(index:number){
//     this.createArtist.artist_albums.splice(index,1);
//     this.updateArtistByCreateArtist();
//   }
  

//   addVideo(){
//     if(!this.addVideoForm.invalid){
//       let params:Video = new Video();
//       for (let key in this.addVideoForm.value) {
//         if (this.addVideoForm.value.hasOwnProperty(key)) {
//             params[key] = this.addVideoForm.value[key];
//         }
//       }
//       // this.createArtist.artist_videos = this.createArtist.videos;
//       this.createArtist.artist_videos.push(params);
//       // 'http://d.zaix.ru/6yut.mp3'
//     //  console.log(`videos list before update`,this.createArtist.artist_videos);
//        this.updateArtistByCreateArtist();
//        this.updateVideosPreview();
//     }
//     else {
      
//     }
//   }

//   deleteVideo(index:number){
//     this.createArtist.artist_videos.splice(index,1);
//     this.updateVideosPreview();
//     this.updateArtistByCreateArtist();
//   }

//   updateVideosPreview(){
//     //console.log(`update VIDEO Images`);
//     for(let video of this.createArtist.artist_videos){
//       let video_id ='';

//       if(video.link.indexOf('youtube'))
//         video_id = video.link.split('v=')[1];
//       if(video.link.indexOf('youtu.be'))
//         video_id = video.link.split('be/')[1];
      
//       // var ampersandPosition = video_id.indexOf('&');
//       // if(ampersandPosition != -1) {
//       //   video_id = video_id.substring(0, ampersandPosition);
//       // }
//       console.log(video,`id`,video_id);

//       video.preview = 'https://img.youtube.com/vi/'+video_id+'/0.jpg';
//     }
//   }

//   openVideo(video:Video){
//     let video_id ='';
//     if(video.link.indexOf('youtube'))
//       video_id = video.link.split('v=')[1];
//     if(video.link.indexOf('youtu.be'))
//       video_id = video.link.split('.be/')[1];

//     // var ampersandPosition = video_id.indexOf('&');
//     // if(ampersandPosition != -1) {
//     //   video_id = video_id.substring(0, ampersandPosition);
    
//     console.log(video,`id`,video_id);
    
//     this.openVideoLink = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+video_id+'?rel=0'); 
//     setTimeout(()=>{$('#modal-movie').modal('show');},100);
 
    
//   }






// loadImage($event:any):void{
//   let target = $event.target;
//   //let file:File = target.files[0];
//   if(target.files.length == 0)
//       return;
  
//   for(let file of target.files)
//   {
//     let reader:FileReader = new FileReader();
//     reader.onload = (e) =>{
//         this.ImageToLoad = reader.result;
//     }
//     reader.readAsDataURL(file);
//   }
 
// }

// DeleteImageFromLoading()
// {
//   this.ImageToLoad = '';
// }

// AddVenuePhoto()
// {
//   // console.log(`image`,this.ImageToLoad)
//   this.main.imagesService.PostAccountImage(this.CurrentAccount.id,{image_base64:this.ImageToLoad,image_description: this.imageInfo})
//     .subscribe(
//       (res:any) => {
//         this.ImageToLoad = '';
//         this.imageInfo = '';
//         this.GetVenueImages();
//       }
//     );
// }


// GetVenueImages()
// {
//   this.main.imagesService.GetAccountImages(this.Artist.id,{limit:5})
//     .subscribe(
//       (res:any)=>{
//         // console.log(`images`,res)
//         if(res && res.total_count > 0)
//         {
//           this.ArtistImages = [];
//           let index = 0;
//           for(let img of res.images)
//           {
//             var txt = img.description?img.description:'';
//             this.GetVenueImageById(img.id,index,txt);
//             index = index + 1;
//           }
//         }
//       }
//     );
// }


// GetVenueImageById(id,saveIndex,text)
// {
//   this.main.imagesService.GetImageById(id)
//     .subscribe(
//       (res:Base64ImageModel) =>{
//         this.ArtistImages.push({img:res.base64,text:text,id:res.id});
//       }
//     );
   
// }

// SanitizeImage(image: string)
// {

//   return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
// }




// getVenuesTypes(){
//   return this.convertArrToCheckModel(
//     [
//       {
//         type:'night_club',
//         type_show:'Night Club'
//       },
//       {
//         type:'bar',
//         type_show:'Bar'
//       },
//       {
//         type:'restaurant',
//         type_show:'Restaurant'
//       },
//       {
//         type:'concert_hall',
//         type_show:'Concert Hall'
//       },
//       {
//         type:'event_space',
//         type_show:'Event Space'
//       },
//       {
//         type:'outdoor_space',
//         type_show:'Outdoor Space'
//       },
//       {
//         type:'theatre',
//         type_show:'Theatre'
//       },
//       {
//         type:'private_residence',
//         type_show:'Private Residence'
//       },
//       {
//         type:'other',
//         type_show:'Other'
//       }
//     ]
//   );
  
// }

// setPreferedVenue(index:number){

//     if(!this.preferredVenues[index].checked){
//         this.preferredVenues[index].checked = true;
//       }
//     else{
//       this.preferredVenues[index].checked = false;
//     }
// }

// addBooking(){

//   this.createArtist.preferred_venues = [];
//   for(let type of this.preferredVenues)
//     if(type.checked)
//       this.createArtist.preferred_venues.push(type.object.type);

//   //console.log(this.createArtist,this.preferredVenues);

//   this.updateArtistByCreateArtist();
// }




 
//   getRiders(){
//     if(this.Artist&&this.Artist.artist_riders){
//       this.riders = [];
//       for(let r of this.Artist.artist_riders){
//         this.riders.push(r);
//         if(r.rider_type=='stage')
//           this.stageRider = r;
//         else if(r.rider_type=='backstage')
//           this.backstageRider = r;
//         else if(r.rider_type=='hospitality')
//           this.hospitalityRider = r;
//         else if(r.rider_type=='technical')
//           this.technicalRider = r;
//       }
//     }
//   }



// loadRiderFile($event:any){
//   let target = $event.target;
//   let file:File = target.files[0];
  
//   for(let file of target.files)
//   {
//     let reader:FileReader = new FileReader();
//     reader.onload = (e) =>{
//       this.stageRider.uploaded_file_base64 = reader.result;
//     }
//     reader.readAsDataURL(file);
//   }
 
// }


//   confirmStageRider(){

//     this.stageRider.rider_type = 'stage';

//     if(!this.stageRider.is_flexible)
//       this.stageRider.is_flexible = false;
//     else 
//       this.stageRider.is_flexible = true;
//     this.createArtist.artist_riders.push(this.stageRider);
    
//     this.updateArtistByCreateArtist();
//   }

//   confirmTechnicalRider(){

//     this.technicalRider.rider_type = 'technical';

//     if(!this.technicalRider.is_flexible)
//       this.technicalRider.is_flexible = false;
//     else 
//       this.technicalRider.is_flexible = true;
//     this.createArtist.artist_riders.push(this.technicalRider);
    
//     this.updateArtistByCreateArtist();
//   }
//   loadTechnicalRiderFile($event:any){
//     let target = $event.target;
//     let file:File = target.files[0];
    
//     for(let file of target.files)
//     {
//       let reader:FileReader = new FileReader();
//       reader.onload = (e) =>{
//         this.technicalRider.uploaded_file_base64 = reader.result;
//       }
//       reader.readAsDataURL(file);
//     }
   
//   }

//   confirmBackstageRider(){

//     this.backstageRider.rider_type = 'backstage';

//     if(!this.backstageRider.is_flexible)
//     this.backstageRider.is_flexible = false;
//     else 
//     this.backstageRider.is_flexible = true;
   
//     this.createArtist.artist_riders.push(this.backstageRider);
    
//     this.updateArtistByCreateArtist();
//   }
//   loadBackstageRiderFile($event:any){
//     let target = $event.target;
//     let file:File = target.files[0];
    
//     for(let file of target.files)
//     {
//       let reader:FileReader = new FileReader();
//       reader.onload = (e) =>{
//         this.backstageRider.uploaded_file_base64 = reader.result;
//       }
//       reader.readAsDataURL(file);
//     }
   
//   }

//   confirmHospitalityRider(){

//     this.hospitalityRider.rider_type = 'hospitality';

//     if(!this.hospitalityRider.is_flexible)
//     this.hospitalityRider.is_flexible = false;
//     else 
//     this.hospitalityRider.is_flexible = true;
    
//     this.createArtist.artist_riders.push(this.hospitalityRider);
    
//     this.updateArtistByCreateArtist();
//   }
//   loadHospitalityRiderFile($event:any){
//     let target = $event.target;
//     let file:File = target.files[0];
    
//     for(let file of target.files)
//     {
//       let reader:FileReader = new FileReader();
//       reader.onload = (e) =>{
//         this.hospitalityRider.uploaded_file_base64 = reader.result;
//       }
//       reader.readAsDataURL(file);
//     }
   
//   }


//   clearNewElements(){

//     this.addSongForm.reset();
//     this.addAlbumForm.reset();
//     this.addVideoForm.reset();

//   }

//   deleteImage(id:number){
//     this.main.imagesService.DeleteImageById(id,this.artistId)
//       .subscribe((res)=>{
//         // console.log(res);
//         this.GetVenueImages();
//       },(err)=>{
//        // console.log(`err`,err);
//       })
//   }

  NextPart()
  {
    if(this.currentPage!=this.pages.media&&this.currentPage!=this.pages.riders)
      this.currentPage = this.currentPage + 1;
  }
  
  ChangeCurrentPart(newPart)
  {

    let prevPage = this.currentPage; 
   
   
    if(this.ArtistId == 0 && newPart > this.pages.about)
      return;

    if(this.currentPage == newPart)
      return;

    this.currentPage = newPart;

    // тут вызвать сохранение страницы до перехода.
    if(prevPage==this.pages.about){
     if(this.AboutPage)
      this.AboutPage.artistFromAbout();
    }
    else if(prevPage==this.pages.booking){
      if(this.BookingPage)
        this.BookingPage.saveArtist();
    }
   
  }



  saveButtonClick(){
    console.log(`SAVE BUTTON`);
  }

  OpenError(str:string){
    this.errorCmp.OpenWindow(BaseMessages.Fail+'. '+str);
  }
  

}

export enum Pages {
    about = 0,
    // calendar = 1,
    media = 1,
    booking = 2,
    riders = 3
}
