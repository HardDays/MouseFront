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

// import { } from 'googlemaps';
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
import { UserGetModel } from '../../core/models/userGet.model';


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


  // isNewArtist:boolean = true;
  Artist:AccountCreateModel = new AccountCreateModel();
  ArtistId:number = 0;
  ArtistImageId:number = 0;

  isMediaWasOpen:boolean = false;

  // isSaveButtonClick:boolean = false;
  // ErrorSave:boolean = false;
  // changePage:boolean = false;

  @ViewChild('AboutPage') AboutPage: ArtistAboutComponent;
  // @ViewChild('MediaPage') MediaPage: ArtistMediaComponent;
  @ViewChild('BookingPage') BookingPage: ArtistBookingComponent;
  @ViewChild('RidersPage') RidersPage: ArtistRidersComponent;

  @ViewChild('errorCmp') errorCmp: ErrorComponent;

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

  ngOnInit()
  {
    this.activatedRoute.params.subscribe(
      (params:Params) => {
        if(params["id"] == 'new')
        {
          this.DisplayArtistParams(null);
        }
        else
        {
          this.WaitBeforeLoading(
            () => this.main.accService.GetAccountById(params["id"],{extended:true}),
            (res:AccountGetModel) => {
              this.DisplayArtistParams(res);
            }, (err)=>{
              this.errorCmp.OpenWindow(this.getResponseErrorMessage(err, 'artist'));
            }
          );
        }
      }
    );
  }

  ngAfterViewChecked()
  {
      this.cdRef.detectChanges();
  }


  DisplayArtistParams($artist?:AccountGetModel)
  {
    this.Artist = $artist ? this.main.accService.AccountGetModelToCreateAccountModel($artist) : new AccountCreateModel();
    this.Artist.account_type = AccountType.Artist;
    if( $artist && $artist.id)
    {
      this.ArtistId = $artist.id;
      this.router.navigateByUrl("/system/artistCreate/"+this.ArtistId);
    }
    else {
      this.currentPage = this.pages.about;
      this.ArtistId = 0;
    }

    if(!this.Artist.artist_email)
    {
      this.WaitBeforeLoading(
        () => this.main.authService.GetMe(),
        (res:UserGetModel) => {
          if(res.email)
            this.Artist.artist_email = res.email.toString();
        }
      );
      
    }

    this.ArtistImageId = ($artist && $artist.image_id) ? $artist.image_id : 0;

  }

 
  //////////////////////////////////////////////
  SaveArtistByPages(artist:AccountCreateModel, goToNextPage:boolean = true)
  {
    // this.Artist = artist;
    console.log(this.ArtistId,this.Artist);
    this.WaitBeforeLoading
    (
      () => this.ArtistId == 0 ? this.main.accService.CreateAccount(this.Artist) : this.main.accService.UpdateMyAccount(this.ArtistId,this.Artist),
      (res) => {
        this.DisplayArtistParams(res);
        this.main.GetMyAccounts(
          () => 
          { 
            this.main.CurrentAccountChange.next(res);
          }
        );

        this.errorCmp.OpenWindow(BaseMessages.Success);
        if(goToNextPage){
          setTimeout(
            () => this.NextPart(),
            2000
          );
        }
        
      },
      (err) => {
        this.errorCmp.OpenWindow(this.getResponseErrorMessage(err, 'artist'));
      }
    )
  }

  SaveArtist()
  {
    this.WaitBeforeLoading
    (
      () => this.ArtistId == 0 ? this.main.accService.CreateAccount(this.Artist) : this.main.accService.UpdateMyAccount(this.ArtistId,this.Artist),
      (res) => {
        this.errorCmp.OpenWindow(BaseMessages.Success);
        //this.main.SetCurrentAccId(this.ArtistId);
        this.main.GetMyAccounts(
          () => 
          { 
            this.main.CurrentAccountChange.next(res);
          }
        );
        setTimeout(
          () => {
            if(this.errorCmp.isShown)
              this.errorCmp.CloseWindow();
            this.router.navigate(["/system","profile",this.ArtistId]);
          },
          2000
        );
      },
      (err) => {
        this.errorCmp.OpenWindow(this.getResponseErrorMessage(err, 'artist'));
      }
    )
  }

  
  NextPart()
  {
    if(this.errorCmp.isShown)
      this.errorCmp.CloseWindow();
    scrollTo(0,0);
    
    this.currentPage = this.currentPage + 1;
  }

  ChangeCurrentPart(newPart)
  {
    if(this.ArtistId == 0)
      return;

    if(this.currentPage === newPart)
      return;

    this.currentPage = newPart;
  }


  SaveArtistNav(){
    this.main.SetCurrentAccId(this.ArtistId);
    this.main.GetMyAccounts();
    setTimeout(
      () => {
        
        if(this.errorCmp.isShown)
          this.errorCmp.CloseWindow();
          this.router.navigate(["/system","profile",this.ArtistId]);
       // scrollTo(0,0);
      },
      2000
    );
  }

  SaveButton()
  {
    console.log(this.Artist);
    switch(this.currentPage){
      case this.pages.about:{
        if(this.AboutPage)
        {
          this.AboutPage.SaveArtist();
          if(this.AboutPage.aboutForm.invalid){
            return;
          }
        }
      }
      case this.pages.booking:{
        if(this.BookingPage){
         this.BookingPage.saveArtist();
         if(!this.BookingPage.Artist.price_from||!this.BookingPage.Artist.price_to){
            return;
          }
        }
      }
      case this.pages.riders:{
        if(this.RidersPage){
         if(!this.RidersPage.saveAllRiders()){
            this.errorCmp.OpenWindow('Please confirm or delete your current riders');
            return;
          }
        }
      } 
    }

    this.SaveArtistNav();
  }

  DeleteImage($event)
  {
    this.main.accService.GetAccountById(this.ArtistId,{extended:true})
      .subscribe(
        (res:AccountGetModel) =>
        {
          this.DisplayArtistParams(res);
        }
      );
  }

  ArtistChanged($event)
  {
    console.log(`artist changed`);
    for(let key of $event)
    {
      if(this.Artist[key] != $event[key])
      {
        this.Artist[key] = $event[key];
      }
    }
  }

  OpenErrorWindow(str:string)
  {
    this.errorCmp.OpenWindow(str);
  }

}

export enum Pages {
    about = 0,
    calendar = 1,
    media = 2,
    booking = 3,
    riders = 4,
    preview = 5
}
