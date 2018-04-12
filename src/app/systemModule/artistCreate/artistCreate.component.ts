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
declare var audiojs:any;
declare var ionRangeSlider:any;

@Component({
  selector: 'artistCreate',
  templateUrl: './artistCreate.component.html',
  styleUrls: ['./artistCreate.component.css']
})




export class ArtistCreateComponent extends BaseComponent implements OnInit {
  
  // general
  accountId:number;
  Artist:AccountGetModel = new AccountGetModel();
  isNewArtist:boolean = true;
  
  pages = Pages;
  currentPage:string = 'about';
  showAllPages:boolean = false;

 

  // about
  createArtist:AccountCreateModel = new AccountCreateModel();
  aboutForm : FormGroup = new FormGroup({        
    "user_name": new FormControl("", [Validators.required]),
    "display_name": new FormControl("", [Validators.required]),
    "stage_name": new FormControl("", [Validators.required]),
    "manager_name": new FormControl("", [Validators.required]),
    "email": new FormControl("", [Validators.required]),
    "about": new FormControl("", [Validators.required]),
    
  });
  genres:GenreModel[] = [];
  showMoreGenres:boolean = false;


  ngOnInit(){
    this.initJS();
    this.initUser();
    this.getGenres();
  }


  initJS(){
  
    var as = audiojs.createAll();
   
    //слайдер аудио, в слайде 12 песен
    $('.slider-audio-wrapp').slick({
        dots: false,
        arrows: true,
        infinite: false,
        slidesToShow: 1

    });
    
    
    
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
            this.currentPage = 'calendar';
            // if(this.isNewArtist)
            //   this.accService.CreateAccount(this.createArtist)
            //   .subscribe((res:any)=>{
            //       this.Artist = res;
            //       this.currentPage = 'calendar';
            //       console.log(`this artist`,this.Artist);
            //   });
           
            // else
            //     this.eventService.UpdateEvent(this.newEvent, this.Event.id)
            //     // this.eventService.CreateEvent(this.newEvent)
            //         .subscribe((res)=>{
            //                 this.Event = res;
            //                 console.log(`create`,this.Event);
            //                 this.currentPage = 'artist';
            //             },
            //             (err)=>{
            //                 console.log(`err`,err);
            //             }
            //     );
        }
        else {
            console.log(`Invalid About Form!`, this.aboutForm);
        }
  }

  






}

export enum Pages {
    about = 0,
    calendar = 1,
    media = 2,
    booking = 3,
    riders = 4
}
