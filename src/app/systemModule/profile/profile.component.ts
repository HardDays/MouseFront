
import { Component, OnInit, OnChanges, ViewChild, ElementRef, NgZone, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import{Location} from '@angular/common';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';
import { AccountService } from '../../core/services/account.service';
import { ImagesService } from '../../core/services/images.service';
import { TypeService } from '../../core/services/type.service';
import { GenresService } from '../../core/services/genres.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { AuthService } from "angular2-social-login";

import { BaseComponent } from '../../core/base/base.component';

import { AccountCreateModel } from '../../core/models/accountCreate.model';
import { UserCreateModel } from '../../core/models/userCreate.model';
import { GenreModel } from '../../core/models/genres.model';
import { AccountGetModel, Album } from '../../core/models/accountGet.model';
import { SafeHtml, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AccountType, BaseImages } from '../../core/base/base.enum';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { MapsAPILoader } from '@agm/core';
import { AccountSearchParams } from '../../core/models/accountSearchParams.model';
import { EventService } from '../../core/services/event.service';
import { Http } from '@angular/http';
import { UserGetModel } from '../../core/models/userGet.model';
import { TicketsGetModel } from '../../core/models/ticketsGetModel';
import { EventGetModel } from '../../core/models/eventGet.model';
import { CheckModel } from '../../core/models/check.model';
import { MainService } from '../../core/services/main.service';
import { FunProfileComponent } from './fun-profile/fun-profile.component';
import { ArtistProfileComponent } from './artist-profile/artist-profile.component';
import { VenueProfileComponent } from './venue-profile/venue-profile.component';


declare var $:any;
declare var PhotoSwipeUI_Default:any;
declare var PhotoSwipe:any;


@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})



export class ProfileComponent extends BaseComponent implements OnInit {

    UserId:number;
    Roles = AccountType;
    Account:AccountGetModel = new AccountGetModel();

    constructor
    (           
        protected main         : MainService,
        protected _sanitizer   : DomSanitizer,
        protected router       : Router,
        protected mapsAPILoader  : MapsAPILoader,
        protected ngZone         : NgZone,
        private activatedRoute : ActivatedRoute,
        private ref: ChangeDetectorRef
        
    ){
        super(main,_sanitizer,router,mapsAPILoader,ngZone);
    }
    isFolowedAcc:boolean;
    @ViewChild('fan') fan:FunProfileComponent;
    @ViewChild('artist') artist:ArtistProfileComponent;
    @ViewChild('venue') venue:VenueProfileComponent;
    ngOnInit(){
        // this.location.subscribe(
        //     (res)=>{
               
        //         this.getAccountMethod();

        //     }

        // );
        
        this.getAccountMethod();

  
    }
    

    getAccountMethod(){
        this.activatedRoute.params.forEach((params)=>{
            this.UserId = params["id"];
            this.main.accService.GetAccountById(this.UserId,{extended:true})
                .subscribe(
                    (resAccount:AccountGetModel)=>
                    {
                        this.Account = resAccount;
                        if(this.Account.account_type == this.Roles.Fan){
                            this.fan = new FunProfileComponent(this.main,this._sanitizer,this.router,this.mapsAPILoader,this.ngZone,this.ref);
                            this.fan.Init(this.Account);
                            // setTimeout(
                            //     ()=>{
                            //         
                            //     },500
                            // );
                               
                            
                        }

                }
            )
        })
    }

}
