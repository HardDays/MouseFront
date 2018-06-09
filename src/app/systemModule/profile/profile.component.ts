
import { Component, OnInit, ViewChild, ElementRef, NgZone, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
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


declare var $:any;
declare var PhotoSwipeUI_Default:any;
declare var PhotoSwipe:any;


@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})



export class ProfileComponent extends BaseComponent implements OnInit,AfterViewChecked {
    MyAccountId:number;
    UserId:number;
    Roles = AccountType;
    SearchParams: AccountSearchParams = new AccountSearchParams();
    Account:AccountGetModel = new AccountGetModel();
    Accounts:AccountGetModel[] = [];
    isMyAccount = false;
    Videos:SafeResourceUrl[] = [];
    FolowersMass:any = [];
    Tickets:TicketsGetModel[] = [];
    Events:EventGetModel[] = [];
    folowersMassChecked:CheckModel<any>[] = [];
    ticketsMassChecked:CheckModel<TicketsGetModel>[] = [];
    EventsMassChecked:CheckModel<EventGetModel>[] = [];
    TotalTicket:number;
    UpcomingShows:CheckModel<EventGetModel>[] = [];
    Albums:CheckModel<Album>[] = [];
    itemsPhotoss:any = [];
    VenueImages:any;
    ImageMassVenue:any = [];
    imagesSize:Base64ImageModel[] = [];
    VideoPath:SafeResourceUrl[] = [];
    baseImageMy:string = '';
    EbanySlider:boolean;
    isFolowedAcc:boolean;

    Fans:AccountGetModel[] = [];

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

    ngOnInit(){

        //this.Videos = this.accService.GetVideo();
    
        this.initUser();
        this.activatedRoute.params.forEach((params)=>{
            this.UserId = params["id"];
        this.getUserInfo();
        })
    }

    ngAfterViewChecked()
    {
        this.cdRef.detectChanges();
    }

    getUserInfo(){
        this.main.accService.GetAccountById(this.UserId,{extended:true})
        .subscribe(
            (resAccount:AccountGetModel)=>
            {
                
                this.InitByUser(resAccount);
                this.main.accService.GetMyAccount()
                    .subscribe((resMy:AccountGetModel[])=>
                    {
                        this.Accounts = resMy;
                        this.MyAccountId = this.GetCurrentAccId();
                        this.isMyAccount = this.Accounts.find(obj => obj.id == this.UserId) != null;
                        this.isFolowed();
                      
                    })
            })
    }
    
    GetFolowersAcc()
    {
        this.Fans = [];
        this.WaitBeforeLoading(
            () => this.main.accService.GetAcauntFolowers(this.UserId),
            (res:any) =>
            {
                this.Fans = res.followers;
            },
            (err) => {
              //  console.log(err);
            
            }
        );
    }
    
    StopThisShit(index:number)
    {
        //let player = window.document.getElementById('#video-iframe-'+index);
        //let player = window.document.getElementById('video-iframe-0');
        let player = $('#video-iframe-0');
        
        //console.log(player);
        //$('#video-iframe-'+index).pauseVideo();
    }



    InitByUser(usr:any)
    {
        this.Account = usr;
        this.GetFolowersAcc();

        if(usr.image_id)
        {
            this.WaitBeforeLoading(
                () => this.main.imagesService.GetImageById(usr.image_id),
                (res:Base64ImageModel)=>{
                    this.baseImageMy = res.base64;
                }
            );
        }
        else{
            this.baseImageMy = '';
        }
    
    }

    initUser(){
        let id = this.GetCurrentAccId();

        this.main.accService.GetMyAccount()
        .subscribe((users:any[])=>{
            let user = users.find(obj=>obj.id == id);
            if(user){
                this.MyAccountId = user.id;
            }
        });
    }

    FollowOrUnfollowProfile(val:boolean)
    {
        (val?this.main.accService.FollowAccountById(this.MyAccountId, this.UserId) : this.main.accService.UnFollowAccountById(this.MyAccountId, this.UserId))
            .subscribe(
                (res:any) =>
                { 
                    this.isFolowedAcc = val;
                    this.GetFolowersAcc();
                },
                (err) => {
                }
            );
    }
  
    isFolowed() {
        this.WaitBeforeLoading(
            () => this.main.accService.IsAccFolowed(this.MyAccountId, this.UserId),
            (res:any) =>
            { 
                this.isFolowedAcc = res.status;
            },
            (err) => {
                // console.log(err);
            
            }
        );
    
    }

}
