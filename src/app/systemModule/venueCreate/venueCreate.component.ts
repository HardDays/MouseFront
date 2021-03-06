import { Component, ViewChild, ElementRef, NgZone, Input, ViewContainerRef, ComponentFactory, OnChanges, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { NgForm,FormControl,FormGroup,Validators, FormArray} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';

import { BaseComponent } from '../../core/base/base.component';
import { OnInit, SimpleChanges, AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';

import { SelectModel } from '../../core/models/select.model';
import { FrontWorkingTimeModel } from '../../core/models/frontWorkingTime.model';
import { WorkingTimeModel } from '../../core/models/workingTime.model';
import { AccountCreateModel } from '../../core/models/accountCreate.model';
import { EventDateModel } from '../../core/models/eventDate.model';
import { ContactModel } from '../../core/models/contact.model';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { AccountType, VenueType, BaseMessages } from '../../core/base/base.enum';
import { GenreModel } from '../../core/models/genres.model';
import { EventCreateModel } from '../../core/models/eventCreate.model';

import { AccountService } from '../../core/services/account.service';
import { ImagesService } from '../../core/services/images.service';
import { TypeService } from '../../core/services/type.service';
import { GenresService } from '../../core/services/genres.service';
import { EventService } from '../../core/services/event.service';

// import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { Router, Params,ActivatedRoute  } from '@angular/router';
import { AuthService } from "angular2-social-login";
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { AccountAddToEventModel } from '../../core/models/artistAddToEvent.model';
import { EventGetModel } from '../../core/models/eventGet.model';
import { AccountSearchModel } from '../../core/models/accountSearch.model';
import { Http, Headers } from '@angular/http';
import { Point } from '@agm/core/services/google-maps-types';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// import { AgmCoreModule } from '@agm/core';
import { CheckModel } from '../../core/models/check.model';
import { TicketModel } from '../../core/models/ticket.model';
import { TicketGetParamsModel } from '../../core/models/ticketGetParams.model';
import { Observable } from 'rxjs/Observable';
import { VenueMediaPhotoModel } from '../../core/models/venueMediaPhoto.model';
import { MainService } from '../../core/services/main.service';
import { ImageAccModel, ImageAccModelAnswer } from '../../core/models/imageAcc.model';
import { VenueHoursComponent } from './hours/hours.component';
import { VenueMediaComponent } from './media/media.component';
import { VenueAboutComponent } from './about/about.component';
import { VenueListingComponent } from './listing/listing.component';
import { VenueDatesComponent } from './dates/dates.component';
import { ErrorComponent } from '../../shared/error/error.component';
import { UserGetModel } from '../../core/models/userGet.model';
import { Currency } from '../../core/models/preferences.model';
import { TranslateService } from '../../../../node_modules/@ngx-translate/core';
import { SettingsService } from '../../core/services/settings.service';



declare var $:any;
declare var ionRangeSlider:any;



@Component({
  selector: 'venueCreate',
  templateUrl: './venueCreate.component.html',
  styleUrls: ['./venueCreate.component.css']
})




export class VenueCreateComponent extends BaseComponent implements OnInit,AfterViewChecked
{

  Parts = PageParts;

  CurrentPart = this.Parts.About;

  Venue:AccountCreateModel = new AccountCreateModel();
  VenueId:number = 0;
  VenueImageId:number = 0;


  isNewVenue = false;

  // isCanVerify = false;

  @ViewChild('about') about:VenueAboutComponent;
  @ViewChild('hours') hours:VenueHoursComponent;
  @ViewChild('media') media:VenueMediaComponent;
  @ViewChild('listing') listing: VenueListingComponent;
  @ViewChild('dates') dates:VenueDatesComponent;

  @ViewChild('errorCmp') errorCmp: ErrorComponent;


  constructor(
    protected main           : MainService,
    protected _sanitizer     : DomSanitizer,
    protected router         : Router,
    protected mapsAPILoader  : MapsAPILoader,
    protected ngZone         : NgZone,
    protected activatedRoute : ActivatedRoute,
    protected cdRef          : ChangeDetectorRef,
    protected translate      :TranslateService,
    protected settings       :SettingsService
  ) {
    super(main,_sanitizer,router,mapsAPILoader,ngZone,activatedRoute,translate,settings);
  }

  ngOnInit()
  {

    this.activatedRoute.params.forEach(
      (params) => {
        if(params["id"] == 'new')
        {
          this.isNewVenue = true;
          this.DisplayVenueParams(null);
        }
        else
        {
          this.WaitBeforeLoading(
            () => this.main.accService.GetAccountById(params["id"],{extended:true}),
            (res:AccountGetModel) => {
              this.DisplayVenueParams(res);
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

  DisplayVenueParams($venue?:AccountGetModel)
  {
    this.Venue = $venue ? this.main.accService.AccountModelToCreateAccountModel($venue) : new AccountCreateModel();
    this.Venue.account_type = AccountType.Venue;
    this.Venue.venue_type = VenueType.Public;
    if( $venue && $venue.id)
    {
      this.VenueId = $venue.id;
      this.router.navigateByUrl("/system/venueCreate/"+this.VenueId);
    }
    else {
      this.CurrentPart = this.Parts.About;
      this.VenueId = 0;
    }

    if(!this.Venue.phone)
    {
      this.WaitBeforeLoading(
        () => this.main.authService.GetMe(),
        (res:UserGetModel) => {
          if(res.register_phone)
            this.Venue.phone = res.register_phone.toString();
        }
      );
    }

    if(!this.Venue.located)
    {
      this.Venue.located = "indoors";
    }

    this.VenueImageId = ($venue && $venue.image_id) ? $venue.image_id : 0;



  }

  SaveVenueByPages(venue:AccountCreateModel)
  {
    delete this.Venue["dates"];
    delete this.Venue["events_dates"];

    this.WaitBeforeLoading
    (
      () => this.VenueId == 0 ? this.main.accService.CreateAccount(this.Venue) : this.main.accService.UpdateMyAccount(this.VenueId,this.Venue),
      (res) => {
        this.DisplayVenueParams(res);

        this.errorCmp.OpenWindow(BaseMessages.Success);

        setTimeout(
          () => this.NextPart(),
          2000
        );
        this.main.GetMyAccounts(
          () => {

            this.main.CurrentAccountChange.next(res);
          }
        );
      },
      (err) => {
        this.errorCmp.OpenWindow(this.getResponseErrorMessage(err, 'venue'));
      }
    )
  }

  SaveVenue()
  {
    delete this.Venue["dates"];
    delete this.Venue["events_dates"];

    this.WaitBeforeLoading
    (
      () => this.VenueId == 0 ? this.main.accService.CreateAccount(this.Venue) : this.main.accService.UpdateMyAccount(this.VenueId,this.Venue),
      (res) => {
        this.DisplayVenueParams(res);
        this.errorCmp.OpenWindow(BaseMessages.Success);
        this.main.GetMyAccounts(
          () => {

            this.main.CurrentAccountChange.next(res);
          }
        );
        setTimeout(
          () => {
            //this.main.CurrentAccountChange.next(res);
            this.errorCmp.CloseWindow();
            this.router.navigate(["/system","profile",this.VenueId]);
            scrollTo(0,0);
          },
          2000
        );
      },
      (err) => {
        this.errorCmp.OpenWindow(this.getResponseErrorMessage(err, 'venue'));
      }
    )
  }

  isEnglish(){
    if (this.settings.GetLang() == 'en')
      return true;
  }

  NextPart()
  {
    this.errorCmp.CloseWindow();
    // if(this.CurrentPart == this.Parts.Dates)
    // {
    //   this.router.navigate(["/system","profile",this.VenueId]);
    //   scrollTo(0,0);
    //   return;
    // }
    scrollTo(0,0);
    this.CurrentPart = this.CurrentPart + 1;
  }

  ChangeCurrentPart(newPart)
  {
    if(this.VenueId == 0)
      return;

    if(this.CurrentPart == newPart)
      return;

    this.CurrentPart = newPart;
  }

  SuperPuperImportantSaveButton()
  {
    let errors = [];
    this.about.aboutForm.updateValueAndValidity();
    if(this.about.aboutForm.invalid)
    {
      let arr = this.GetOnlyFromErrorMessages(this.about.aboutForm, 'venue');
      for(let i of arr)
      {
          errors.push(i);
      }
    }
    if(this.Venue.fax&&this.Venue.fax.indexOf('_')>=0)
    {
      errors.push('<b>Fax</b> needs to be a valid number')
    }
    if(this.dates){
      this.dates.dateForm.updateValueAndValidity();
      if(this.dates.dateForm.invalid)
      {
        let arr = this.GetOnlyFromErrorMessages(this.dates.dateForm, 'venue');
        for(let i of arr)
        {
          errors.push(i);
        }
      }
    }
    if(this.listing){
      this.listing.detailsForm.updateValueAndValidity();
      if(this.listing.detailsForm.invalid)
      {
        let arr = this.GetOnlyFromErrorMessages(this.listing.detailsForm, 'venue');
        for(let i of arr)
        {
          errors.push(i);
        }
      
      }
    }
    if(this.media)
    {
      this.media.mediaForm.updateValueAndValidity();
      if(this.media.mediaForm.invalid)
      {
        let arr = this.GetOnlyFromErrorMessages(this.media.mediaForm, 'venue');
        for(let i of arr)
        {
          errors.push(i);
        }
      }
    }

    if(errors.length > 0)
    {
      this.OpenErrorWindow(errors.length > 3? BaseMessages.AllFields : errors.join('<br/>'));
      return;
    }
    this.SaveVenue();

  }


  clickVerifyButton(){
    if(!this.Venue.capacity){
      this.OpenErrorWindow('Please fill in capacity first');
      return;
    }
    if(!this.Venue.audio_description){
      this.OpenErrorWindow('Please fill in audio description first');
      return;
    }
    if(!this.Venue.lighting_description){
      this.OpenErrorWindow('Please fill in lighting description first');
      return;
    }
    if(!this.Venue.stage_description){
      this.OpenErrorWindow('Please fill in stage description first');
      return;
    }
    this.SaveVenueAndVerify();

  }

  SaveVenueAndVerify()
  {
    if(this.VenueId !== 0){
      this.WaitBeforeLoading
          (
            () => this.main.accService.UpdateMyAccount(this.VenueId,this.Venue),
            (res) => {
              this.DisplayVenueParams(res);

              this.main.accService.VerifyAccount(this.VenueId)
                .subscribe(
                  (res)=>{
                    this.Venue.status = 'unchecked';
                    this.errorCmp.OpenWindow(BaseMessages.Success);
                    // this.isCanVerify = false;
                  }
                )
            },
            (err) => {
              this.errorCmp.OpenWindow(this.getResponseErrorMessage(err, 'venue'));
            }
          )
    }

  }

  DeleteImage($event)
  {
    // this.main.accService.GetAccountById(this.VenueId,{extended:true})
    //   .subscribe(
    //     (res:AccountGetModel) =>
    //     {
    //       this.DisplayVenueParams(res);
    //     }
    //   );
  }

  VenueChanged($event)
  {
    for(let key of $event)
    {
      if(this.Venue[key] != $event[key])
      {
        this.Venue[key] = $event[key];
      }
    }
  }

  OpenErrorWindow(str:string)
  {
    this.errorCmp.OpenWindow(str);
  }
}

export enum PageParts
{
  About = 0,
  Hours = 1,
  Listing = 2,
  Media = 3,
  Dates = 4,
  Preview = 5
};
