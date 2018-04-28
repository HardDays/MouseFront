
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
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


declare var $:any;
declare var PhotoSwipeUI_Default:any;
declare var PhotoSwipe:any;


@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})



export class ProfileComponent extends BaseComponent implements OnInit {
    MyAccountId:number;
    UserId:number;
    Roles = AccountType;
    SearchParams: AccountSearchParams = new AccountSearchParams();
    Account:AccountCreateModel = new AccountCreateModel();
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
    isFolowedAcc:boolean;
    imagesSize:any = [];
    constructor(protected authService: AuthMainService,
      protected accService:AccountService,
      protected imgService:ImagesService,
      protected typeService:TypeService,
      protected genreService:GenresService,
      protected eventService:EventService,
      protected _sanitizer: DomSanitizer,
      protected router: Router,public _auth: AuthService,
      private activatedRoute: ActivatedRoute, protected h:Http,
      private ngZone: NgZone){
super(authService,accService,imgService,typeService,genreService,eventService,_sanitizer,router,h,_auth);
}

ngOnInit(){

    //this.Videos = this.accService.GetVideo();
 
    this.initUser();
    this.activatedRoute.params.forEach((params)=>{
        this.UserId = params["id"];
        this.accService.GetAccountById(this.UserId,{extended:true})
            .subscribe(
                (resAccount:AccountGetModel)=>
                {
                    
                    this.InitByUser(resAccount);
                    this.accService.GetVideoArr(
                        (data:SafeResourceUrl[]) => {
                            this.Videos = data;
                        },
                        ()=>{
                            this.InitSliderWrapp();
                        }
                    );

                    this.accService.GetMyAccount()
                        .subscribe((resMy:AccountGetModel[])=>
                        {
                            this.Accounts = resMy;

                            this.isMyAccount = this.Accounts.find(obj => obj.id == this.UserId) != null;
                            this.isFolowed();
                          
                        })
                })
    })

  
}
Gallery(event) {
    
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
GalaryInit(event){

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
        //console.log("date", this.SearchParams);
        this.WaitBeforeLoading(
            () => this.accService.GetImagesVenue(this.UserId),
            (res:any) =>
            {
                this.VenueImages = this.convertArrToCheckModel<any>(res.images);
                for(let it of this.VenueImages){
                    it.checked = true;
                }
                this.GetImage();
                this.GetImageSize();
                
            },
            (err) => {
                console.log(err);
            }
        );
    }
GetImage()
  {
      for(let i in this.VenueImages){
        if(this.VenueImages[i].object && this.VenueImages[i].object.id)
        {
            this.WaitBeforeLoading(
                () => this.imgService.GetImageById(this.VenueImages[i].object.id),
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
            () => this.imgService.GetImageSize(this.VenueImages[i].object.id),
            (res:Base64ImageModel) => {
            
                this.imagesSize[i] = res;

                console.log(this.imagesSize);
            },
            (err) =>{
                console.log(err);
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

GetEvents()
    {
      
        this.WaitBeforeLoading(
            () => this.eventService.GetEvents(this.UserId),
            (res:EventGetModel[]) =>
            {
                this.EventsMassChecked = this.convertArrToCheckModel<EventGetModel>(res);
                for(let it of this.EventsMassChecked){
                    it.checked = true;
                }
               
          
            },
            (err) => {
                console.log(err);
            }
        );
    }
GetTickets()
{
    this.WaitBeforeLoading(
        () => this.eventService.GetAllTicketswithoutCurrent(this.UserId),
        (res:TicketsGetModel[]) =>
        {
            this.ticketsMassChecked = this.convertArrToCheckModel<TicketsGetModel>(res);
            for(let it of this.ticketsMassChecked){
                it.checked = true;
            }
            this.CountTotaltTicket();
        },
        (err) => {
            console.log(err);
        }
    );
}
CountTotaltTicket(){
    this.TotalTicket = 0;
    for(let i of this.ticketsMassChecked){
      this.TotalTicket+=i.object.tickets_count;
     
    }
  }
GetFolowersAcc(){
    this.WaitBeforeLoading(
        () => this.accService.GetAcauntFolowers(this.UserId),
        (res:any) =>
        {
            this.folowersMassChecked = this.convertArrToCheckModel<any>(res.followers);
            for(let it of this.folowersMassChecked){
                it.checked = true;
            }
           
        },
        (err) => {
            console.log(err);
         
        }
    );
}
GetUpcomingShows(){
    this.WaitBeforeLoading(
        () => this.accService.GetUpcomingShows(this.UserId),
        (res:any) =>
        { 
            console.log(res);
            
            
           this.UpcomingShows = this.convertArrToCheckModel<any>(res);
            for(let it of this.UpcomingShows){
                it.checked = true;
            }
           
        },
        (err) => {
            console.log(err);
         
        }
    );
}
searchUpcomingShows(event){
    let searchParam = event.target.value;
    for(let it of this.UpcomingShows){
        if(it.object.name.indexOf(searchParam)>=0){
            it.checked = true;
        }
        else{
            it.checked = false;
        }
    }
}
searchFolover(event){
    let searchParam = event.target.value;
    for(let it of this.folowersMassChecked){
        if(it.object.user_name.indexOf(searchParam)>=0){
            it.checked = true;
        }
        else{
            it.checked = false;
        }
    }
}
searchTickets(event){
    let searchParam = event.target.value;
    for(let it of this.ticketsMassChecked){
        if(it.object.name.indexOf(searchParam)>=0){
            it.checked = true;
        }
        else{
            it.checked = false;
        }
    }
}
searchEvents(event){
    let searchParam = event.target.value;
    for(let it of this.EventsMassChecked){
        if(it.object.name.indexOf(searchParam)>=0){
            it.checked = true;
        }
        else{
            it.checked = false;
        }
    }
}
searchAlboms(event){
    let searchParam = event.target.value;
    for(let it of this.Albums){
        if(it.object.album_name.indexOf(searchParam)>=0){
            it.checked = true;
        }
        else{
            it.checked = false;
        }
    }
}
InitSliderWrapp() {
    let that = this;
    $('.iframe-slider-wrapp').slick({
        dots: false,
        arrows: true,
        infinite: false,
        slidesToShow: 1

    });
    $('.iframe-slider-wrapp').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        //that.StopThisShit(currentSlide);
        //console.log(event);
        //console.log(slick);
        currentSlide = nextSlide;
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



  InitByUser(usr:any){
    this.Account = usr;
    this.GetFolowersAcc();
   
    
    if(this.Account.account_type == this.Roles.Venue)
    {
      this.Account.office_hours = this.accService.ParseWorkingTimeModelArr(this.Account.office_hours);
      this.Account.operating_hours = this.accService.ParseWorkingTimeModelArr(this.Account.operating_hours);
      this.GetUpcomingShows();
      this.GetVenueImages();
      
    }
    if(this.Account.account_type == this.Roles.Fan){
        this.GetTickets();
        this.GetEvents();
    }
    if(this.Account.account_type == this.Roles.Artist){
        this.Albums = this.convertArrToCheckModel<Album>(this.Account.artist_albums);
        for(let it of this.Albums){
            it.checked = true;
        }
        this.GetUpcomingShows();

    }

    if(usr.image_id){
        this.imgService.GetImageById(usr.image_id)
            .subscribe((res:Base64ImageModel)=>{
                this.Account.image_base64 = res.base64;
            });
    }
 
}


LOGOUT_STUPID(){
  localStorage.removeItem('access');
  this.router.navigate(['/access']);
}

login(){
  this.router.navigate(['/system','login']);
}

logout(){

  this.Logout();
}
initUser(){
    this.accService.GetMyAccount({extended:true})
    .subscribe((users:any[])=>{
        for(let u of users)
        if(u.id==+localStorage.getItem('activeUserId')){
          this.MyAccountId = u.id;
          console.log(u.id);
        }
    });
}
FollowProfile() {
  this.WaitBeforeLoading(
    () => this.accService.FollowAccountById(this.MyAccountId, this.UserId),
    (res:any) =>
    { 
   
        this.isFolowed();
    },
    (err) => {
        console.log(err);
     
    }
);

}


UnFollowProfile() {
    this.WaitBeforeLoading(
      () => this.accService.UnFollowAccountById(this.MyAccountId, this.UserId),
      (res:any) =>
      { 
          
          this.isFolowed();
      },
      (err) => {
          console.log(err);
       
      }
  );
  
  }
  
  isFolowed() {
    this.WaitBeforeLoading(
      () => this.accService.IsAccFolowed(this.MyAccountId, this.UserId),
      (res:any) =>
      { 
          this.isFolowedAcc = res.status;
      },
      (err) => {
          console.log(err);
       
      }
  );
  
  }

}
