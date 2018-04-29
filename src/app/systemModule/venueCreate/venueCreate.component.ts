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
import { AccountType, VenueType } from '../../core/base/base.enum';
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



declare var $:any;
declare var ionRangeSlider:any;



@Component({
  selector: 'venueCreate',
  templateUrl: './venueCreate.component.html',
  styleUrls: ['./venueCreate.component.css']
})




export class VenueCreateComponent extends BaseComponent implements OnInit 
{
  Parts = PageParts;

  CurrentPart = this.Parts.About;

  Venue:AccountCreateModel = new AccountCreateModel();
  VenueId:number = 0;


  @ViewChild('hours') hours:VenueHoursComponent;
  @ViewChild('media') media:VenueMediaComponent;
  
  constructor
  (           
    protected main          : MainService,
    protected _sanitizer    : DomSanitizer,
    protected router        : Router,
    protected mapsAPILoader : MapsAPILoader,
    protected ngZone        : NgZone,
    private activatedRoute  : ActivatedRoute
  ){
    super(main,_sanitizer,router,mapsAPILoader,ngZone);
  } 

  ngOnInit()
  {
    this.activatedRoute.params.forEach(
      (params) => {
        if(params["id"] == 'new')
        {
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
    if(this.hours)
      this.hours.Init(this.Venue);
    if(this.media)
      this.media.Init(this.Venue,this.VenueId);
  }

  

  SaveVenue(venue:AccountCreateModel)
  {
    this.WaitBeforeLoading
    (
      () => this.VenueId == 0 ? this.main.accService.CreateAccount(this.Venue) : this.main.accService.UpdateMyAccount(this.VenueId,this.Venue),
      (res) => {
        this.DisplayVenueParams(res);
        this.NextPart();
        this.GetMyAccounts();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  NextPart()
  {
    if(this.CurrentPart == this.Parts.Dates)
      this.router.navigate(["/system","profile",this.VenueId]);
      
    scrollTo(0,0);
    this.CurrentPart = this.CurrentPart + 1;
  }
  
  ChangeCurrentPart(newPart)
  {
    if(this.VenueId == 0 && newPart > this.Parts.About)
      return;

    if(this.CurrentPart == newPart)
      return;

    this.CurrentPart = newPart;
  }
    
}

export enum PageParts
{
  About = 0,
  Hours = 1,
  Listing = 2,
  Media = 3,
  Dates = 4
};
