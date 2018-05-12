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
  ArtistId:number = 0;

  isSaveButtonClick:boolean = false;
  ErrorSave:boolean = false;
  changePage:boolean = false;

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
              this.errorCmp.OpenWindow(this.getResponseErrorMessage(err, 'artist'));
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
    else{
      this.currentPage = this.pages.about;
      this.ArtistId = 0;
    }

    if(this.AboutPage)
      this.AboutPage.Init(this.Artist);
    if(this.MediaPage)
      this.MediaPage.Init(this.Artist,this.ArtistId);
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
        this.ArtistId = res.id;
        this.main.SetCurrentAccId(res.id);
        this.main.GetMyAccounts();
        this.DisplayArtistParams(res);
        this.NextPart();
      },
      (err) => {
        this.errorCmp.OpenWindow(this.getResponseErrorMessage(err, 'artist'));
      }
    )
  }


  NextPart()
  {
    if(!this.changePage){
      if(!this.isSaveButtonClick&&this.currentPage!=this.pages.media&&this.currentPage!=this.pages.riders)
      this.currentPage = this.currentPage + 1;
    }
    this.changePage = false;
  }

  ChangeCurrentPart(newPart)
  {

    this.changePage = true;
    let prevPage = this.currentPage; 
   
    if(this.ArtistId == 0 && newPart > this.pages.about)
      return;
    else{
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
      if(this.MediaPage)
        this.MediaPage.Init(this.Artist,this.ArtistId);
    }

  }



  saveButtonClick(){
    this.isSaveButtonClick = true;
    this.ErrorSave = false;
    if(this.currentPage==this.pages.about){
      if(this.AboutPage)
       this.AboutPage.artistFromAbout();
     }
     else if(this.currentPage==this.pages.booking){
       if(this.BookingPage)
         this.BookingPage.saveArtist();
     }

    if(!this.ErrorSave){
      this.errorCmp.OpenWindow(BaseMessages.Success);
      setTimeout(() => {
        this.errorCmp.CloseWindow();
        this.router.navigate(['/system','profile',this.ArtistId]);
      }, 3000);
    }
  }

  OpenError(str:string){
    this.ErrorSave = true;
    this.errorCmp.OpenWindow(str);
  }


}

export enum Pages {
    about = 0,
    // calendar = 1,
    media = 1,
    booking = 2,
    riders = 3,
    preview = 4
}
