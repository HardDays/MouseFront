
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

                        this.isMyAccount = this.Accounts.find(obj => obj.id == this.UserId) != null;
                        this.isFolowed();
                      
                    })
            })
    }

    GetVidio()
    {
        this.VideoPath = [];
        //console.log(this.Account);
        if(this.Account.videos && this.Account.videos.length > 0)
        {
        
            for(let i in this.Account.videos){
                let link = this.Account.videos[i].link;
                let id = this.GetVideoId(link);
                let path = id? ("https://www.youtube.com/embed/" + id) : "";
                if(path)
                {
                    this.VideoPath[i] = this.SanitizePath(path);
                }
                
            }
            setTimeout(()=>{
                this.InitSliderWrapp();
            },300);
           
            
        }
      
    }
    SanitizePath(path:string)
    {
        return this._sanitizer.bypassSecurityTrustResourceUrl(path);
    }
    GetVideoId(url:string)
    {
        let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = url.match(regExp);

        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return false;
        }
    }

    Gallery(event) 
    {
        let itemsPhoto = [];
        $('.for-gallery-item').each(function (e) {
            var href = $(this).attr('data-hreff')
                , size = $(this).data('size').split('x')
                , width = size[0]
                , height = size[1];
            var item = {
                src: href
                , w: width
                , h: height
            }
            itemsPhoto.push(item);

        });
        this.itemsPhotoss = itemsPhoto;
        this.GalaryInit(event);   
    }
    GalaryInit(event)
    {
        var index = event.srcElement.dataset.eteration;

        var options = {
            index: parseInt(index),
            bgOpacity: 1,
            showHideOpacity: true,
            history: false,
        }
        var lightBox = new PhotoSwipe($('.pswp')[0], PhotoSwipeUI_Default, this.itemsPhotoss, options);
        lightBox.init();
    }
    GetVenueImages()
    {
        this.WaitBeforeLoading(
            () => this.main.accService.GetImagesVenue(this.UserId),
            (res:any) => {
                this.VenueImages = this.convertArrToCheckModel<any>(res.images);
                for(let it of this.VenueImages){
                    it.checked = true;
                }
                this.GetImage();
                this.GetImageSize();
                
            },
            (err) => {
               // console.log(err);
            }
        );
    }
    GetImage()
    {
      for(let i in this.VenueImages){
        if(this.VenueImages[i].object && this.VenueImages[i].object.id)
        {
            this.WaitBeforeLoading(
                () => this.main.imagesService.GetImageById(this.VenueImages[i].object.id),
                (res:Base64ImageModel) => {
                    this.ImageMassVenue[i] = (res && res.base64) ? res.base64 : BaseImages.Drake;
                },
                (err) =>{
                    this.ImageMassVenue[i] = BaseImages.Drake;
                }
            );
        }
        else{
            this.ImageMassVenue[i] = BaseImages.Drake;
        }
      }
     
  }
  GetImageSize()
  {
    for(let i in this.VenueImages){
        this.WaitBeforeLoading(
            () => this.main.imagesService.GetImageSize(this.VenueImages[i].object.id),
            (res:Base64ImageModel) => {
            
                this.imagesSize[i] = res;

              //  console.log(this.imagesSize);
            },
            (err) =>{
               // console.log(err);
            }
        );
    }
     
  }
  searchImagesVenue(event){
    let searchParam = event.target.value;
    for(let it of this.VenueImages){
        if(it.object.description.indexOf(searchParam)>=0){
            it.checked = true;
        }
        else{
            it.checked = false;
        }
    }
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
    GetUpcomingShows(){
        this.WaitBeforeLoading(
            () => this.main.accService.GetUpcomingShows(this.UserId),
            (res:any) =>
            { 
                this.UpcomingShows = this.convertArrToCheckModel<any>(res);
                for(let it of this.UpcomingShows){
                    it.checked = true;
                }
            },
            (err) => {
              //  console.log(err);
            
            }
        );
    }
    searchUpcomingShows(event)
    {
        let searchParam = event.target.value;
        for(let it of this.UpcomingShows)
        {
            if(it.object.name.indexOf(searchParam)>=0)
            {
                it.checked = true;
            }
            else
            {
                it.checked = false;
            }
        }
    }
    searchFolover(event)
    {
        let searchParam = event.target.value;
        for(let it of this.folowersMassChecked)
        {
            if(it.object.user_name.indexOf(searchParam)>=0)
            {
                it.checked = true;
            }
            else
            {
                it.checked = false;
            }
        }
    }
    
    
    searchAlboms(event)
    {
        let searchParam = event.target.value;
        for(let it of this.Albums)
        {
            if(it.object.album_name.indexOf(searchParam)>=0)
            {
                it.checked = true;
            }
            else
            {
                it.checked = false;
            }
        }
    }

    InitSliderWrapp() 
    {
        $('.iframe-slider-wrapp').not('.slick-initialized').slick({
            dots: false,
            arrows: true,
            infinite: false,
            slidesToShow: 1

        });
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
    
        
        if(this.Account.account_type == this.Roles.Venue)
        {
        this.Account.office_hours = this.main.accService.ParseWorkingTimeModelArr(this.Account.office_hours);
        this.Account.operating_hours = this.main.accService.ParseWorkingTimeModelArr(this.Account.operating_hours);
        this.GetUpcomingShows();
        this.GetVenueImages();
       
        }
        if(this.Account.account_type == this.Roles.Artist){
            this.Albums = this.convertArrToCheckModel<Album>(this.Account.artist_albums);
            this.GetVidio();
            for(let it of this.Albums){
                it.checked = true;
            }
            this.GetUpcomingShows();
        }

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
FollowProfile() {
  this.WaitBeforeLoading(
    () => this.main.accService.FollowAccountById(this.MyAccountId, this.UserId),
    (res:any) =>
    { 
        this.isFolowed();
        this.getUserInfo();
    },
    (err) => {
       // console.log(err);
     
    }
);

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
