
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
import { AccountType } from '../../core/base/base.enum';
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
                            console.log(this.isMyAccount);
                        })
                })
    })
//   this.accService.GetMyAccount()
//   .subscribe((res:AccountGetModel[])=>{
//       this.isMyAccount = false;
//       this.activatedRoute.params.forEach((params) => {
//       this.UserId = params["id"];
//       this.Accounts = res;
//       this.accService.GetAccountById(this.UserId, {extended:true})
//         .subscribe((user:any)=>{

//             for(let acc of this.Accounts) {
//                 if(acc.id == this.UserId) {
//                     this.isMyAccount = true;
//                     break;
//                 }
//             }
//             this.InitByUser(user);
//         })
//     });
    // setTimeout(()=>{
    //     this.Wrapper();
    // },500);
//   })
  
}

GetEvents()
    {
        //console.log("date", this.SearchParams);
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

Gallery() {
$('.gallery-main-wrapp').each(function () {
    var pic = $(this)
        , getItems = function () {
            var items = [];
            //console.log("1");
            pic.find('.for-gallery-item').each(function () {
                var href = $(this).attr('data-hreff')
                    , size = $(this).data('size').split('x')
                    , width = size[0]
                    , height = size[1];
                var item = {
                    src: href
                    , w: width
                    , h: height
                }
                items.push(item);
            });
            return items;
        }
    var items = getItems();
    var pswp = $('.pswp')[0];
    pic.on('click', '.one-block', function (event) {
        event.preventDefault();
        var index = $(this).index();
        var options = {
                index: parseInt(index),
                bgOpacity: 1,
                showHideOpacity: true,
                history: false,
                getThumbBoundsFn: function(index) {
                  var thumbnail = document.querySelectorAll('.for-gallery-item')[index];
                  var pageYScroll = window.pageYOffset || document.documentElement.scrollTop; 
                  var rect = thumbnail.getBoundingClientRect(); 
                  return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
              }
            }
            // Initialize PhotoSwipe
        //console.log(options);
        var lightBox = new PhotoSwipe(pswp, PhotoSwipeUI_Default, items, options);
        lightBox.init();
    });
});
}

  InitByUser(usr:any){
    this.Account = usr;
    
    console.log(111);
    console.log(this.Albums);
    this.GetFolowersAcc();
    
    
    
    if(this.Account.account_type == this.Roles.Venue)
    {
      this.Account.office_hours = this.accService.ParseWorkingTimeModelArr(this.Account.office_hours);
      this.Account.operating_hours = this.accService.ParseWorkingTimeModelArr(this.Account.operating_hours);
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
  //console.log('logout');
  this.Logout();
}

FollowProfile() {
  this.accService.FollowAccountById(this.Accounts[0].id, this.UserId);
}

  

}
