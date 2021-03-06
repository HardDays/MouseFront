import { Component, ViewChild, ElementRef, NgZone, Input, ViewContainerRef, ComponentFactory, ChangeDetectorRef } from '@angular/core';
import { NgForm,FormControl,FormGroup,Validators} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';

import { BaseComponent } from '../../core/base/base.component';
import { OnInit, AfterViewChecked, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

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

// import { } from 'googlemaps';
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
import { EventSearchParams } from '../../core/models/eventSearchParams';
import { TicketTypeModel } from '../../core/models/ticketType.model';
import { MainService } from '../../core/services/main.service';
import { TranslateService } from '../../../../node_modules/@ngx-translate/core';
import { SettingsService } from '../../core/services/settings.service';

declare var $:any;

@Component({
  selector: 'feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})


export class FeedComponent extends BaseComponent implements OnInit, AfterViewChecked {


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

  Feed:any[] = [];
  accId:number = 0;
  ScrollDisabled = false;
  EnableScroll = false;

  ngOnInit(){
    this.EnableScroll = true;
    this.GetFeed();
    $('.body-feed-item .photos-wrapp').css({
         'max-height': $('.for-min-height-photos').width()
     });
     $(window).resize(function(){
         $('.body-feed-item .photos-wrapp').css({
             'max-height': $('.for-min-height-photos').width()
         });
     });


    window.addEventListener('scroll', ()=> {
      if(this.EnableScroll){
        if(($(window).scrollTop()+$(window).height())>=$('footer').offset().top){
              if(!this.ScrollDisabled)
                this.onScroll();
            }
      }
    });

  }

   ngOnDestroy(){
     this.EnableScroll = false;
     window.removeEventListener('scroll',()=>{
     });
    }

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }

  
  
  GetFeed(){
    this.accId = this.GetCurrentAccId();
    if (this.accId){    
      this.WaitBeforeLoading(
        ()=>this.main.feedService.GetFeedByAccId(this.accId,10,0),
        (res)=>
      {
        this.Feed = res;
      },
      (err)=>
      {
      }
    )}

  }

  onScroll(){

    this.ScrollDisabled = true;
    this.main.feedService.GetFeedByAccId(this.accId,10,this.Feed.length)
      .subscribe(
      (res)=>
      {
        this.Feed.push(...res);
        this.ScrollDisabled = false;
      },
      (err)=>
      {
      })
  }


  
}
  
