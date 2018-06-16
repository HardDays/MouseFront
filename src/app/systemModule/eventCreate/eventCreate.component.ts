import { Component, ViewChild, ElementRef, NgZone, Input, ViewContainerRef, ComponentFactory, ChangeDetectorRef } from '@angular/core';
import { NgForm,FormControl,FormGroup,Validators, FormArray} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';

import { BaseComponent } from '../../core/base/base.component';
import { OnInit, AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';

import { SelectModel } from '../../core/models/select.model';
import { FrontWorkingTimeModel } from '../../core/models/frontWorkingTime.model';
import { WorkingTimeModel } from '../../core/models/workingTime.model';
import { AccountCreateModel } from '../../core/models/accountCreate.model';
import { EventDateModel } from '../../core/models/eventDate.model';
import { ContactModel } from '../../core/models/contact.model';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { AccountType, BaseMessages } from '../../core/base/base.enum';
import { GenreModel } from '../../core/models/genres.model';
import { EventCreateModel } from '../../core/models/eventCreate.model';

import { AccountService } from '../../core/services/account.service';
import { ImagesService } from '../../core/services/images.service';
import { TypeService } from '../../core/services/type.service';
import { GenresService } from '../../core/services/genres.service';
import { EventService } from '../../core/services/event.service';

// import {} from 'googlemaps';
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

import { AgmCoreModule } from '@agm/core';
import { CheckModel } from '../../core/models/check.model';
import { TicketModel } from '../../core/models/ticket.model';
import { TicketGetParamsModel } from '../../core/models/ticketGetParams.model';
import { GetArtists, GetVenue, EventPatchModel } from '../../core/models/eventPatch.model';
import { MessageInfoModel, InboxMessageModel } from '../../core/models/inboxMessage.model';
import { NumberSymbol } from '@angular/common';
import { identifierModuleUrl } from '@angular/compiler';
import { MainService } from '../../core/services/main.service';
import { ArtistComponent } from './artist/artist.component';
import { AboutComponent } from './about/about.component';
import { VenuesComponent } from './venues/venues.component';
import { FundingComponent } from './funding/funding.component';
import { AddTicketsComponent } from './tickets/tickets.component';
import { ErrorComponent } from '../../shared/error/error.component';







declare var $:any;
declare var ionRangeSlider:any;

@Component({
  selector: 'eventCreate',
  templateUrl: './eventCreate.component.html',
  styleUrls: ['./eventCreate.component.css']
})


export class EventCreateComponent extends BaseComponent implements OnInit, AfterViewChecked {


  Event:EventCreateModel = new EventCreateModel()
  EventId:number = 0;

  @ViewChild('about') about:AboutComponent;
  @ViewChild('artist') artist:ArtistComponent;
  @ViewChild('venue') venue:VenuesComponent;
  @ViewChild('funding') funding:FundingComponent;
  @ViewChild('tickets') tickets:AddTicketsComponent;

  @ViewChild('errorCmp') errorCmp: ErrorComponent;

  pages = Pages;
  currentPage = this.pages.about;

  isShowLaunch:boolean = false;

  isSaveBtnClick:boolean = false;
  isNewEvent = false;

  artistPreview:number = 0;
  venuePreview:number = 0;

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
        if(params["id"] === 'new')
        {
          this.isNewEvent = true;
          this.DisplayEventParams(null);
        }
        else
        {
          this.WaitBeforeLoading(
            () => this.main.eventService.GetEventById(params["id"]),
            (res:EventGetModel) => {
              this.DisplayEventParams(res);
            }, (err)=>{
              this.errorCmp.OpenWindow(this.getResponseErrorMessage(err, 'event'));
            }
          );
        }
        
      }
    );
  }

  DisplayEventParams($event?:EventGetModel)
  {
    this.Event = $event ? this.main.eventService.EventModelToCreateEventModel($event) : new EventCreateModel();
    if($event&&$event.id)
    {
      this.EventId = $event.id;
      this.router.navigateByUrl("/system/eventCreate/"+this.EventId);
      this.isShowLaunch = this.isShowLaunchBtn();
    }
  }

  SaveEventByPages(event:EventCreateModel)
  {
    this.Event.account_id = this.CurrentAccount.id;
    this.WaitBeforeLoading
    (
      () => this.EventId === 0 ? this.main.eventService.CreateEvent(this.Event) : this.main.eventService.UpdateEvent(this.EventId,this.Event),
      (res) => {
        this.DisplayEventParams(res);

        this.errorCmp.OpenWindow(BaseMessages.Success);

        setTimeout(
          () => this.NextPart(),
          2000
        );
        
        this.isShowLaunch = this.isShowLaunchBtn();

      },
      (err) => {
        console.log(`err`,err);
        this.errorCmp.OpenWindow(this.getResponseErrorMessage(err, 'event'));
      }
    )
  }

  SaveEvent()
  {
    //alert(`SAVE EVENT`);
    this.Event.account_id = this.CurrentAccount.id;
    
    if(this.about)
      this.about.GetEventGenres();

    this.WaitBeforeLoading
    (
      () => this.EventId === 0 ? this.main.eventService.CreateEvent(this.Event) : this.main.eventService.UpdateEvent(this.EventId,this.Event),
      (res) => {

        this.errorCmp.OpenWindow(BaseMessages.Success);
        
        setTimeout(
          () => {
            this.errorCmp.CloseWindow();
            this.router.navigate(["/system","events"]);
          },
          2000
        );
      },
      (err) => {
        this.errorCmp.OpenWindow(this.getResponseErrorMessage(err, 'event'));
      }
    )
  }

  NextPart()
  {
    

    setTimeout(() => {
      if(this.errorCmp.isShown)
        this.errorCmp.CloseWindow();

      if(this.currentPage === this.pages.tickets ||this.isSaveBtnClick)
        this.router.navigate(["/system","events"]);
      
        scrollTo(0,0);
      this.currentPage = this.currentPage + 1;
    }
    , 2000);
  }

    

  ChangeCurrentPart(newPart)
  {
    if(this.EventId === 0 && newPart > this.pages.about)
      return;

    if(this.currentPage === newPart)
      return;

    this.currentPage = newPart;
  }

  
  isShowLaunchBtn(){
    let countA = 0, countV = 0;

    if(this.Event&&this.Event.artist)
    for(let a of this.Event.artist)
      if(a.status==='owner_accepted'||a.status==='active')
        countA++;

    if(this.Event&&this.Event.venues)
    for(let v of this.Event.venues)
      if(v.status==='owner_accepted'||v.status==='active')
        countV++;

    if(!this.Event.is_active && countA>0 && countV>0 ) return true;
      else return false;

  }

  activeButtonClick(){
    
    this.main.eventService.SetActive(this.EventId,this.main.CurrentAccount.id).
      subscribe((res)=>{
        this.Event.is_active = true;
      },
      (err)=>{
        console.log(`err`,err);
        this.OpenErrorWindow(BaseMessages.Fail);
      }
    )  
  }

  unActiveButtonClick(){
    this.main.eventService.SetDeActive(this.EventId,this.main.CurrentAccount.id).
      subscribe((res)=>{
        this.Event.is_active = false;
      },
      (err)=>{
        console.log(`err`,err);
        this.OpenErrorWindow(BaseMessages.Fail);
      }
    )  
  }

  
  EventChanged($event)
  {
    for(let key of $event)
    {
      if(this.Event[key] !== $event[key])
      {
        this.Event[key] = $event[key];
      }
    }
  }

  OpenErrorWindow(str:string)
  {
    this.errorCmp.OpenWindow(str);
  }

  openPreviewArtist(id:number){
    this.currentPage = this.pages.previewArtist;
    this.artistPreview = id;
  }
  openPreviewVenue(id:number){
    this.currentPage = this.pages.previewVenue;
    this.venuePreview = id;
  }

}

export enum Pages {
    about = 0,
    artist = 1,
    venue = 2,
    funding = 3,
    tickets = 4,
    previewArtist = 5,
    previewVenue = 6
}
