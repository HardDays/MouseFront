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
import { AccountType } from '../../core/base/base.enum';
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



declare var $:any;
declare var ionRangeSlider:any;

@Component({
  selector: 'eventCreate',
  templateUrl: './eventCreate.component.html',
  styleUrls: ['./eventCreate.component.css']
})


export class EventCreateComponent extends BaseComponent implements OnInit {
    
    
    Event:EventCreateModel = new EventCreateModel()
    EventId:number = 0;

   
  
    @ViewChild('about') about:AboutComponent;
    @ViewChild('artist') artist:ArtistComponent;
    @ViewChild('venue') venue:ArtistComponent;
    @ViewChild('funding') funding:ArtistComponent;
    @ViewChild('tickets') tickets:ArtistComponent;
    
    pages = Pages;
    currentPage = this.pages.about;


    constructor
    (           
        protected main         : MainService,
        protected _sanitizer   : DomSanitizer,
        protected router       : Router,
        protected mapsAPILoader  : MapsAPILoader,
        protected ngZone         : NgZone,
        private activatedRoute : ActivatedRoute
    ){
        super(main,_sanitizer,router,mapsAPILoader,ngZone);
        
        
    }

    ngOnInit()
    {
      this.activatedRoute.params.forEach(
        (params) => {
          if(params["id"] == 'new')
          {
            this.DisplayEventParams(null);
          }
          else
          {
            this.WaitBeforeLoading(
              () => this.main.eventService.GetEventById(params["id"]),
              (res:EventGetModel) => {
                this.DisplayEventParams(res);
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
      }
      if(this.about)
        this.about.Init(this.Event);
      if(this.artist)
        this.artist.Init(this.Event);
      if(this.venue)
        this.venue.Init(this.Event);
      if(this.funding)
        this.funding.Init(this.Event);
       if(this.tickets)
         this.tickets.Init(this.Event);
    }


    SaveEvent(venue:EventCreateModel)
    {
      this.Event.account_id = this.CurrentAccount.id;
      this.WaitBeforeLoading
      (
        () => this.EventId == 0 ? this.main.eventService.CreateEvent(this.Event) : this.main.eventService.UpdateEvent(this.EventId,this.Event),
        (res) => {
          this.DisplayEventParams(res);
          this.NextPart();
        },
        (err) => {
          console.log(err);
        }
      )
    }

    NextPart()
    {
      if(this.currentPage == this.pages.tickets)
        this.router.navigate(["/system","profile",this.EventId]);
        
      scrollTo(0,0);
      this.currentPage = this.currentPage + 1;
    }
    
    ChangeCurrentPart(newPart)
    {
      if(this.EventId == 0 && newPart > this.pages.about)
        return;
  
      if(this.currentPage == newPart)
        return;
  
      this.currentPage = newPart;
    }

    



    //// ########################################################################################## ////

    // initSlider()
    // {
   
    //     this.addArtist.estimated_price = 20000;
    //     var hu_3 = $(".current-slider-price-venue").ionRangeSlider({
    //         min: 0,
    //         max: 100000,
    //         from: 20000,
    //         step: 5,
    //         type: "single",
    //         hide_min_max: false,
    //         prefix: "$ ",
    //         grid: false,
    //         prettify_enabled: true,
    //         prettify_separator: ',',
    //         grid_num: 5,
    //         onChange: function (data) {
    //             _the.VenuePriceChanged(data);
    //         }
    //     });
    //     var hu_4 = $(".current-slider-capacity-venue").ionRangeSlider({
    //         min: 0,
    //         max: 100000,
    //         from: 10000,
    //         step: 10,
    //         type: "single",
    //         hide_min_max: false,
    
    //         grid: false,
    //         prettify_enabled: true,
    //         prettify_separator: ',',
    //         grid_num: 5,
    //         onChange: function (data) {
    //             _the.VenueCapacityChanged(data);
    //         }
    //     });
    // }

    // navigateTo(path:string)
    // {
    //     $('body, html').animate({
    //         scrollTop: $('#'+path).offset().top
    //     }, 800);
    // } 



   
    // venueDragMarker($event)
    // {
    //     //console.log($event);
    //     this.mapCoords.venue.lat = $event.coords.lat;
    //     this.mapCoords.venue.lng = $event.coords.lng;
    //     this.codeLatLng( this.mapCoords.venue.lat, this.mapCoords.venue.lng, "venueAddress");
    // }

    // setMapCoords(event,map:string){
    //     this.mapCoords[map] = {lat:event.coords.lat,lng:event.coords.lng};
    //     console.log(map);
    //     this.codeLatLng( this.mapCoords[map].lat, this.mapCoords[map].lng, map+"Address");

    // }

    // codeLatLng(lat, lng, id_map) {
    //     let geocoder = new google.maps.Geocoder();
    //     let latlng = new google.maps.LatLng(lat, lng);
    //     geocoder.geocode(
    //         {'location': latlng }, 
    //         (results, status) => {
    //             if (status === google.maps.GeocoderStatus.OK) {
    //                 if (results[1]) {
    //                     //   //console.log(results[1]);
    //                     let id = "#"+id_map;
    //                     $(id).val(results[1].formatted_address);
                        
    //                     if(id_map=='aboutAddress')
    //                         this.newEvent.address = results[1].formatted_address;
    //                     else if(id_map=='artistAddress'){
    //                         this.artistSearchParams.address = results[1].formatted_address;
    //                         this.artistSearch();
    //                     }
    //                     else if(id_map=='venueAddress'){
    //                         this.venueSearchParams.address = results[1].formatted_address;
    //                         this.venueSearch();
    //                     }
    //                 } 
    //                 else {
    //                 // alert('No results found');
    //                 }
    //             } 
    //             else {
    //                 // alert('Geocoder failed due to: ' + status);
    //             }
    //         }
    //     );
    // }

    // addNewArtistOpenModal()
    // {
    //     $('#modal-pick-artist').modal('show');
    //     // this.changeDetector.detectChanges();
    // }
    // sendVenueRequestOpenModal(venue:AccountGetModel)
    // {
    //     $('#modal-send-request-venue').modal('show');
    //     this.eventForRequest = venue;
    //     // this.eventForRequest.user_name
    //     //console.log(this.eventForRequest);
    // }
    // sendArtistRequestOpenModal(artist:AccountGetModel)
    // {
    //     $('#modal-send-request-artist').modal('show');
    //     this.artistForRequest = artist;
    //     // this.eventForRequest.user_name
    //     //console.log(this.eventForRequest);
    // }

    // aboutOpenMapModal()
    // {
    //     $('#modal-map-1').modal('show');
    // }
    // artistOpenMapModal()
    // {
    //     $('#modal-map-2').modal('show');
    //     this.artistSearch();
    // }
    // venueOpenMapModal()
    // {
    //     $('#modal-map-3').modal('show');
    // }

    // //// ########################################################################################## ////

    // initUser()
    // {
    //     this.WaitBeforeLoading(
    //         () => this.main.accService.GetMyAccount({extended:true}),
    //         (users:any[])=>{
    //             let id = this.GetCurrentAccId();
    //             for(let u of users)
    //             {
    //                 if(u.id==id)
    //                 {
    //                     this.accountId = u.id;
    //                     this.newEvent.account_id = this.accountId;
    //                     this.addArtist.account_id = this.accountId;
    //                     this.addVenue.account_id = this.accountId;
    //                     this.getMessages(this.accountId);
    //                 }
    //             }
    //         }
    //     );
    // }
       


    // // general
    // getGenres()
    // {
    //     // this.WaitBeforeLoading(
    //     //     () => this.main.genreService.GetAllGenres(),
    //     //     (res:string[])=>{
    //     //         this.genres = this.main.genreService.StringArrayToGanreModelArray(res);
    //     //         for(let i of this.genres) 
    //     //             i.show = true;

    //     //         this.genresSearchArtist = this.main.genreService.StringArrayToGanreModelArray(res);
    //     //         for(let i of this.genresSearchArtist) 
    //     //             i.show = true;
    //     //       }
    //     // );
       
    // }
    // getAllSpaceTypes(){
    //     let types:SelectModel[] = this.main.typeService.GetAllSpaceTypes();
    //     this.typesSpace = this.convertArrToCheckModel<SelectModel>(types);
    // }
    // maskNumbers(){
    //     return {
    //       mask: [/[1-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/],
    //       keepCharPositions: true,
    //       guide:false
    //     };
    // }

    // getListImages(list:any[]){
    //     if(list)
    //     for(let item of list)
    //     {
    //         if(item.image_id)
    //         {
    //             this.WaitBeforeLoading(
    //                 () => this.main.imagesService.GetImageById(item.image_id),
    //                 (res:Base64ImageModel)=>{
    //                     item.image_base64_not_given = res.base64;
    //                 }
    //             );
    //         }
    //     }
    // }

    // deleteDuplicateAccounts(a:AccountGetModel[])
    // {
    //     for (var q=1, i=1; q<a.length; ++q) 
    //     {
    //         if (a[q].id !== a[q-1].id) 
    //         {
    //             a[i++] = a[q];
    //         }
    //     }
    //     a.length = i;
    //     return a;
    // }

    // deleteDuplicateTickets(t:TicketModel[])
    // {
    //     for (var q=1, i=1; q<t.length; ++q) 
    //     {
    //         if (t[q].id !== t[q-1].id) 
    //         {
    //             t[i++] = t[q];
    //         }
    //     }
    //     t.length = i;
    //     return t;
    // }

    // isNewAccById(mas:any[],val:any)
    // {
    //     for(let i=0;i<mas.length;i++)
    //     {
    //         if(mas[i].id==val.id) return false;
    //     }
    //     return true;
    // }

    // getThisEvent(id:number)
    // {
    //     this.WaitBeforeLoading(
    //         () => this.main.accService.GetMyAccount({extended:true}),
    //         (users:any[])=>{
    //             let userId = this.GetCurrentAccId();
    //             this.WaitBeforeLoading(
    //                 () => this.main.eventService.GetMyEvents(userId),
    //                 (res:EventGetModel[])=>{
    //                     for(let v of res)
    //                     {
    //                         if(v.id == id)
    //                         {
    //                             this.accountId = userId;
    //                             this.newEvent.account_id = this.accountId;
    //                             this.addArtist.account_id = this.accountId;
    //                             this.addVenue.account_id = this.accountId;
                                
    //                             this.isNewEvent = false;
    //                             this.Event = v;
    //                             this.updateEvent();  
    //                             this.showAllPages = true;
    //                             this.getMessages(this.accountId);                  
    //                         }
    //                     }
    //                     if(this.isNewEvent)
    //                         this.router.navigate(['/system/eventCreate']);
    //                 }
    //             );
    //         }
    //     );
    // }

    // getMessages(id?:number)
    // {
    //     let crId = id?id:this.Event.creator_id;
    //     this.messagesList = [];
    //     this.WaitBeforeLoading(
    //         () => this.main.accService.GetInboxMessages(crId),
    //         (res)=>{
            
    //             for(let m of res)
    //             {
    //                 this.WaitBeforeLoading(
    //                     () => this.main.accService.GetInboxMessageById(crId, m.id),
    //                     (msg)=>{
    //                         this.messagesList.push(msg);
    //                         //console.log(`msg`,this.messagesList);
    //                     }
    //                 );
    //             }
    //         },
    //         (err)=>{//console.log(err)
    //         }
    //     );
    // }
    
    // getPriceAtMsg(sender:number)
    // {
    //     for(let m of this.messagesList)
    //     {
    //         if( m.sender_id == sender && 
    //             m.receiver_id == this.Event.creator_id &&
    //             m.message_info.event_info.id == this.Event.id)
    //         {
    //                return m.message_info.price;
    //         }
    //     }
    //     return '-';
    // }

    // getIdAtMsg(sender:number)
    // {
    //     for(let m of this.messagesList)
    //     {
    //         if( m.sender_id == sender && 
    //             m.receiver_id == this.Event.creator_id &&
    //             m.message_info.event_info.id == this.Event.id)
    //         {
    //                return m.id;
    //         }
    //     }
    // }




    // updateEvent(event?){
    //     console.log(`updateEvent`);
    //     if(!event)
    //     this.main.eventService.GetEventById(this.Event.id).
    //         subscribe((res:EventGetModel)=>{
    //             console.log(`updateEvent`);
    //             this.Event = res;
              
               
                    
    //             //     for (let key in res) {
    //             //         if (res.hasOwnProperty(key)) {
    //             //             this.newEvent[key] = res[key];
    //             //         }
    //             //     }

                
    //             //     this.imgService.GetImageById(this.Event.image_id).
    //             //         subscribe((img)=>{
    //             //             console.log(img);
    //             //             this.newEvent.image_base64 = img.base64;
    //             //     });
                
                
                    
    //             // // this.codeLatLng( this.newEvent.city_lat, this.newEvent.city_lng, "aboutAddress");
    //             // // this.mapCoords.about.lat = this.newEvent.city_lat;
    //             // // this.mapCoords.about.lng = this.newEvent.city_lng;
                
    //             // // this.genreFromModelToVar();
                    

    //             //  this.getShowsArtists();
    //             //  this.getRequestVenue();
    //             //  this.getTickets();
    //             //  this.getMessages();
    //     });
    //     else this.Event = event;
    // }

    // genreFromModelToVar()
    // {
    // //     for(let g of  this.newEvent.genres)
    // //     {
    // //         for(let gnr of this.genres)
    // //         {
    // //             if(g == gnr.genre)
    // //                 gnr.checked = true;
    // //         }
    // //     }
    //  }

    // // GengeSearch($event:string)
    // // {
    // //     var search = $event;
    // //     if(search.length>0) 
    // //     {
    // //        for(let g of this.genres)
    // //         {
    // //             if(g.genre_show.indexOf(search.toUpperCase())>=0)
    // //                 g.show = true;
    // //             else
    // //                 g.show = false;
    // //         }
    // //      }
    // //      else 
    // //      {
    // //         for(let i of this.genres) 
    // //             i.show = true;
    // //      }
    // // }

    // uploadImage($event)
    // {
    //     this.ReadImages(
    //         $event.target.files,
    //         (res:string)=>{
    //            this.newEvent.image_base64 = res;
    //         }
    //     );
    // }

    // // createEventFromAbout()
    // // {
    // //     if(!this.aboutForm.invalid)
    // //     {
    // //         for (let key in this.aboutForm.value) 
    // //         {
    // //             if (this.aboutForm.value.hasOwnProperty(key)) 
    // //             {
    // //                 this.newEvent[key] = this.aboutForm.value[key];
    // //             }
    // //         }

    // //         this.newEvent.event_time = this.newEvent.event_time.toLowerCase();
    // //         if(this.newEvent.is_crowdfunding_event==null)
    // //             this.newEvent.is_crowdfunding_event = false;

            
    // //         this.newEvent.genres = this.main.genreService.GenreModelArrToStringArr(this.genres);

    // //         this.newEvent.city_lat = this.mapCoords.about.lat;
    // //         this.newEvent.city_lng = this.mapCoords.about.lng;

    // //         this.newEvent.account_id = this.accountId;

    // //         this.WaitBeforeLoading(
    // //             () => this.isNewEvent ? this.main.eventService.CreateEvent(this.newEvent) : this.main.eventService.UpdateEvent(this.newEvent, this.Event.id),
    // //             (res)=>{
    // //                 this.Event = res;
    // //                 //console.log(`create`,this.Event);
    // //                 this.currentPage = 'artist';
    // //             },
    // //             (err)=>{
    // //                 //console.log(`err`,err);
    // //             }
    // //         );
    // //     }
    // //     else {
    // //         //console.log(`Invalid About Form!`, this.aboutForm);
    // //     }
    // // }
    
    // addNewArtist()
    // {
    //     this.addArtist.event_id = this.Event.id;
    //     this.addArtist.time_frame = 'one_week';

    //     for(let item of this.checkArtists){
    //         this.addArtist.artist_id = item;
            
    //         this.WaitBeforeLoading(
    //             () => this.main.eventService.AddArtist(this.addArtist),
    //             (res)=>{
    //                 //console.log(`add artist`,item);
    //                 // this.eventService.ArtistSendRequest(this.addArtist)
    //                 // .subscribe((send)=>{
    //                 //     this.updateEvent();
    //                 // })
    //                 this.updateEvent();
    //             }
    //         );
    //     }
    // }

    // artistSendRequest(id:number)
    // {
    //     for (let key in this.requestArtistForm.value) 
    //     {
    //         if (this.requestArtistForm.value.hasOwnProperty(key)) 
    //         {
    //             this.addArtist[key] = this.requestArtistForm.value[key];
    //         }
    //     }
    //     this.addArtist.id = id;
    //     this.addArtist.event_id = this.Event.id;
    //     // console.log(`request artist`,this.addArtist);
    //     this.WaitBeforeLoading(
    //         () => this.main.eventService.ArtistSendRequest(this.addArtist),
    //         (send)=>{
    //             this.updateEvent();
    //         }
    //     );
    // }

    // getShowsArtists()
    // {
    //     this.showsArtists = [];
    //     for(let artist of this.Event.artist){

    //         this.WaitBeforeLoading(
    //             () => this.main.accService.GetAccountById(artist.artist_id),
    //             (res:AccountGetModel)=>{
    //                 //    if(this.isNewAccById( this.showsArtists,res))
    //                 //         {
    //                 this.showsArtists.push(res);
    //                 //console.log(`SHOW ARTISTS`, this.showsArtists);

    //                 if(res.image_id){
    //                     //console.log(`get image `, res.image_id);
    //                     this.WaitBeforeLoading(
    //                         () => this.main.imagesService.GetImageById(res.image_id),
    //                         (img:Base64ImageModel)=>{
    //                             res.image_base64_not_given = img.base64;
    //                         },
    //                         (err)=>{
    //                             //console.log(`err img`,err);
    //                         }
    //                     );
    //                 }
    //                 // }
    //             }
    //         );
    //     }
    // }



    // getStatusArtistEventById(id:number)
    // {
    //     for(let art of this.Event.artist)
    //     {
    //         if(art.artist_id == id) 
    //             return art.status;
    //     }
        
    //     return 'not found artist';
    // }
    
    // addArtistCheck(id)
    // {
    //     let index = this.checkArtists.indexOf(id);
    //     if (index < 0)
    //         this.checkArtists.push(id);
    //     else 
    //         this.checkArtists.splice(index,1);
    //     //console.log(this.checkArtists);
    // }

    // ifCheckedArtist(id)
    // {
    //     if(this.checkArtists.indexOf(id)<0) 
    //         return false;
    //     else 
    //         return true;
    // }
    // artistSearch($event?:string)
    // {
    //     if($event) 
    //         this.artistSearchParams.text = $event;

    //     this.artistSearchParams.type = 'artist';
    //     this.artistSearchParams.genres = this.main.genreService.GenreModelArrToStringArr(this.genresSearchArtist);
   
    //     this.WaitBeforeLoading(
    //         () => this.main.accService.AccountsSearch(this.artistSearchParams),
    //         (res)=>{
    //             if(res.length>0)
    //             {
    //                 this.artistsList = this.deleteDuplicateAccounts(res);
    //                 //console.log(`artists`,this.artistsList);
    //                 this.getListImages(this.artistsList);
    //             }
    //         }
    //     );
    // }

    // artistLimitSearch()
    // {
    //     this.artistSearchParams.type = 'artist';
    //     this.artistSearchParams.limit = 10;
    //     this.WaitBeforeLoading(
    //         () => this.main.accService.AccountsSearch(this.artistSearchParams),
    //         (res)=>{
    //             if(res.length>0){
    //                 this.artistsList = this.deleteDuplicateAccounts(res);
    //                 this.getListImages(this.artistsList);
    //             }
    //         }
    //     );
    // }

    // PriceArtistChanged(data:any)
    // {
    //     this.addArtist.estimated_price = data.from;
    // }

    // sliceName(text:string)
    // {
    //     if(text)
    //     {
    //         if(text.length<15) 
    //             return text;
    //         else 
    //             return text.slice(0,14)+'...';
    //     }
    // }
    // sliceGenres(mas:string[])
    // {
    //     if(mas)
    //     {   
    //         if(mas.length<4)
    //             return mas;
    //         else 
    //             return mas.slice(0,3)+'...';
    //     }
    // }

    // toBeatyShowsList( mas:any[])
    // {
    //     let list: string = '';
    //     for(let item of mas)
    //         list+= item.toUpperCase()+", ";
    //     let answer = '';
    //     for(let i=0;i<list.length-2;i++)
    //     {
    //         if(list[i]!="_") 
    //             answer += list[i];
    //         else 
    //             answer += " ";
    //     }
    //     return answer;
    // }

    // acceptArtistCard(card:AccountGetModel)
    // {
    //     this.ownerAcceptDecline.account_id = this.Event.creator_id;
    //     this.ownerAcceptDecline.id = card.id;
    //     this.ownerAcceptDecline.event_id = this.Event.id;
    //     let msgId = this.getIdAtMsg(card.id);
    //     this.ownerAcceptDecline.message_id = msgId;
    //      let msg = this.messagesList[0];
    //     for(let m of this.messagesList)
    //         if(m.id == msgId) msg = m;
    //     this.ownerAcceptDecline.datetime_from = msg.message_info.preferred_date_from;
    //     this.ownerAcceptDecline.datetime_to =  msg.message_info.preferred_date_to;

    //     // console.log( this.ownerAcceptDecline);
    //     this.WaitBeforeLoading(
    //         () => this.main.eventService.ArtistAcceptOwner(this.ownerAcceptDecline),
    //         (res)=>{
    //             // console.log(`ok accept artist`,res);
    //             this.updateEvent();
    //         }
    //     );

    // }


    // declineArtist(card:AccountGetModel){

    //     this.ownerAcceptDecline.account_id = this.Event.creator_id;
    //     this.ownerAcceptDecline.id = card.id;
    //     this.ownerAcceptDecline.event_id = this.Event.id;
    //     let msgId = this.getIdAtMsg(card.id);
    //     this.ownerAcceptDecline.message_id = msgId;
    //      let msg = this.messagesList[0];
    //     for(let m of this.messagesList)
    //         if(m.id == msgId) msg = m;
    //     this.ownerAcceptDecline.datetime_from = msg.message_info.preferred_date_from;
    //     this.ownerAcceptDecline.datetime_to =  msg.message_info.preferred_date_to;

    //     // console.log( this.ownerAcceptDecline);
    //     this.main.eventService.ArtistDeclineOwner(this.ownerAcceptDecline).
    //         subscribe((res)=>{
    //             // console.log(`ok decline artist`,res);
    //             this.updateEvent();
    //         });

    // }




    // // venue

    
    // venueSearch($event?:string){
    //     this.venueList = [];
      
    //     this.venueSearchParams.type = 'venue';
    //     if($event) this.venueSearchParams.text = $event;
    //     this.venueSearchParams.types_of_space = [];
        
    //     for(let space of this.typesSpace)
    //         if(space.checked) this.venueSearchParams.types_of_space.push(space.object.value)

    //      this.main.accService.AccountsSearch( this.venueSearchParams).
    //          subscribe((res)=>{
    //              if(res.length>0){
    //                  this.venueList = this.deleteDuplicateAccounts(res);
    //                  this.getListImages(this.venueList);
    //              }
    //      });
    // }
    // venueLimitSearch(){
    //     this.venueList = [];
      
    //     this.venueSearchParams.type = 'venue';
    //     this.venueSearchParams.limit = 10;

    //      this.main.accService.AccountsSearch( this.venueSearchParams).
    //          subscribe((res)=>{
    //              if(res.length>0){
    //                  this.venueList = this.deleteDuplicateAccounts(res);
    //                  this.getListImages(this.venueList);
    //              }
    //      });
    // }
    // VenuePriceChanged(data){
    //     this.venueSearchParams.price_from  = data.from;
    //     this.venueSearch();

    // }
    // VenueCapacityChanged(data){
    //     this.venueSearchParams.capacity_from = data.from;
    //     this.venueSearch();
    // }


    // addVenueCheck(venue:AccountGetModel){
    //      if(!this.ifRequestVenue(venue.id)){
    //         // console.log(`ifRequestVenue`);
    //         let index = this.checkVenue.indexOf(venue.id);
    //         // console.log(index);
    //         if (index < 0)
    //         {
    //             // console.log(`<0`);
    //             this.checkVenue.push(venue.id);
    //             this.venueShowsList.push(venue);
    //         }
    //         else {
    //             // console.log(`else`);
    //             this.checkVenue.splice(index,1);
    //             this.venueShowsList.splice(index,1);
    //         }
    //         //console.log(this.checkVenue);
    //      }
    //     //*this.addNewVenue();
    // }

    // ifCheckedVenue(id){
    //     if(this.checkVenue.indexOf(id)<0) return this.ifRequestVenue(id);
    //         else return true;
    // }
    
    // ifRequestVenue(id){
    //     for(let v of this.requestVenues)
    //         if(v.id==id) {
    //             // //console.log(`IN Request`, id);
    //             return true;
    //         }
    //     // //console.log(`NO in Request`, id);
    //     return false;
    // }
    // ifShowsVenue(id){
    //     for(let v of this.venueShowsList)
    //         if(v.id==id) {
    //             // //console.log(`IN Request`, id);
    //             return true;
    //         }
    //     // //console.log(`NO in Request`, id);
    //     return false;
    // }

    
    // getRequestVenue(){
    //     this.requestVenues = [];
    //     for(let venue of this.Event.venues){
    //         this.main.accService.GetAccountById(venue.venue_id).
    //             subscribe((res:AccountGetModel)=>{
    //                 if(this.isNewAccById(this.requestVenues,res)){
    //                         this.requestVenues.push(res);
    //                         let index = 0;
    //                         for(let sh of this.venueShowsList){
    //                             if(sh.id==res.id) this.venueShowsList.splice(index,1);
    //                             index = index + 1;
    //                         }
    //                         if(this.ifShowsVenue(res.id)){
    //                             // console.log(`ifShowsVenue`);
    //                             this.addVenueCheck(res);
    //                         }
    //                         if(res.image_id){
    //                             this.main.imagesService.GetImageById(res.image_id)
    //                                 .subscribe((img:Base64ImageModel)=>{
    //                                     res.image_base64_not_given = img.base64;
    //                                 },
    //                                 (err)=>{
    //                                     //console.log(`err img`,err);
    //                                 });
    //                         }
    //                  }
    //         });
    //     }
    // }



    // addVenueById(id:number){

    //         if(!this.requestVenueForm.invalid){

    //             for (let key in this.requestVenueForm.value) {
    //                 if (this.requestVenueForm.value.hasOwnProperty(key)) {
    //                     this.addVenue[key] = this.requestVenueForm.value[key];
    //                 }
    //             }
    //             this.addVenue.estimated_price = +this.requestVenueForm.value['estimated_price'];
    
    //             this.addVenue.event_id = this.Event.id;
    //             this.addVenue.venue_id = id;
    //             this.addVenue.id = id;
    //             // console.log(`add venue`,this.addVenue);
                
    //             this.main.eventService.AddVenue(this.addVenue).
    //                 subscribe((res)=>{
    //                     // console.log(`ok add`);
    //                     this.main.eventService.VenueSendRequest(this.addVenue)
    //                      .subscribe((send)=>{
    //                     this.updateEvent();
    //                 }, (err)=>{console.log(err);})
                        
    //             },(err)=>{
    //                 this.main.eventService.VenueSendRequest(this.addVenue)
    //                      .subscribe((send)=>{
    //                     this.updateEvent();
    //                 });
    //             });
        
    //         }
    //         else {
    //             //console.log(`Invalid Request Form!`, this.aboutForm);
    //         }
    // }

    // getStatusVenueEventById(id:number){
        
    //     for(let v of this.Event.venues)
    //         if(v.venue_id == id) return v.status;
        
    //     return 'not found artist';
    // }

    // acceptVenue(card:AccountGetModel){
    //     //console.log(idV);

    //         this.ownerAcceptDecline.account_id = this.Event.creator_id;
    //         this.ownerAcceptDecline.id = card.id;
    //         this.ownerAcceptDecline.event_id = this.Event.id;
    //         let msgId = this.getIdAtMsg(card.id);
    //         this.ownerAcceptDecline.message_id = msgId;
    //         let msg = this.messagesList[0];
    //         for(let m of this.messagesList)
    //             if(m.id == msgId) msg = m;
    //         this.ownerAcceptDecline.datetime_from = msg.message_info.preferred_date_from;
    //         this.ownerAcceptDecline.datetime_to =  msg.message_info.preferred_date_to;

    //         // console.log(this.ownerAcceptDecline);
    //         this.main.eventService.VenueAcceptOwner(this.ownerAcceptDecline).
    //             subscribe((res)=>{
    //                 //console.log(`ok accept artist`,res);
    //                 this.updateEvent();
    //             });
    
    //         //console.log(this.ownerAcceptDecline);   
    // }

    // declineVenue(card:AccountGetModel){

    //     this.ownerAcceptDecline.account_id = this.Event.creator_id;
    //     this.ownerAcceptDecline.id = card.id;
    //     this.ownerAcceptDecline.event_id = this.Event.id;
    //     let msgId = this.getIdAtMsg(card.id);
    //     this.ownerAcceptDecline.message_id = msgId;
    //     let msg = this.messagesList[0];
    //     for(let m of this.messagesList)
    //         if(m.id == msgId) msg = m;
    //     this.ownerAcceptDecline.datetime_from = msg.message_info.preferred_date_from;
    //     this.ownerAcceptDecline.datetime_to =  msg.message_info.preferred_date_to;
    
    //     // console.log(this.ownerAcceptDecline);
        
    //         this.main.eventService.VenueDeclineOwner(this.ownerAcceptDecline).
    //             subscribe((res)=>{
    //                 //console.log(`ok accept artist`,res);
    //                 this.updateEvent();
    //             });
    
    //         //console.log(this.ownerAcceptDecline); 
    // }








    // // funding
   

    
    // // getActiveArtVen(){

    // //     this.artistSum = 0;
    // //     this.venueSum = 0;
    // //     let artist:GetArtists[] = [], venue:GetVenue[] = [];
    // //     // console.log(this.Event);
    // //      for(let art of this.Event.artist)
    // //         if(art.status=='owner_accepted'||art.status=='active'){
    // //             let num = this.getNumInArtistOrVenueById(art.artist_id,this.showsArtists);
    // //             art.image_base64_not_given = this.showsArtists[num].image_base64_not_given;
    // //             art.user_name_not_given =  this.showsArtists[num].user_name;

    // //                 //заглушка на старые запросы
    // //                 if(!art.agreement.price) art.agreement.price = 100;

    // //             artist.push(art);
    // //         }
    // //     for(let v of this.Event.venues)
    // //         if(v.status=='owner_accepted'||v.status=='active'){
    // //             let num = this.getNumInArtistOrVenueById(v.venue_id,this.requestVenues);
    // //             v.image_base64_not_given = this.requestVenues[num].image_base64_not_given;
    // //             v.user_name_not_given =  this.requestVenues[num].user_name;
    // //         }



    // //     // console.log(this.activeArtist);
    // //     this.getListImages(this.activeArtist);
    // //     this.getListImages(this.activeVenue);

            
    // //     }

    
    // setActiveArtist(index:number){
    //     if(!this.activeArtist[index].checked){
    //         this.activeArtist[index].checked = true;
    //         this.artistSum += this.activeArtist[index].object.agreement.price;
    //         this.main.eventService.ArtistSetActive({
    //             id:this.activeArtist[index].object.artist_id,
    //             event_id:this.Event.id,
    //             account_id:this.Event.creator_id
    //         }).
    //             subscribe((res)=>{
    //                 //console.log(`active set ok`,res);
    //                 this.updateEvent();
    //             });
    //     }
    //     else {
    //         this.activeArtist[index].checked = false;
    //         this.artistSum -= this.activeArtist[index].object.agreement.price;
    //         this.main.eventService.ArtistRemoveActive({
    //             id:this.activeArtist[index].object.artist_id,
    //             event_id:this.Event.id,
    //             account_id:this.Event.creator_id
    //         }).
    //             subscribe((res)=>{
    //                 //console.log(`active remove ok`,res);
    //                 this.updateEvent();
    //             });
    //     }
    //     //console.log(this.activeArtist);
    // }

    // setActiveVenue(index:number){
    //     if(!this.activeVenue[index].checked){
    //         this.activeVenue[index].checked = true;
    //         this.venueSum += this.activeVenue[index].object.agreement.price;
    //         this.main.eventService.VenueSetActive({
    //             id:this.activeVenue[index].object.venue_id,
    //             event_id:this.Event.id,
    //             account_id:this.Event.creator_id
    //         }).
    //             subscribe((res)=>{
    //                 //console.log(`active set ok`,res);
    //                 this.updateEvent();
    //             });
    //     }
    //     else {
    //         this.activeVenue[index].checked = false;
    //         this.venueSum -= this.activeVenue[index].object.agreement.price;
    //         this.main.eventService.VenueRemoveActive({
    //             id:this.activeVenue[index].object.venue_id,
    //             event_id:this.Event.id,
    //             account_id:this.Event.creator_id
    //         }).
    //             subscribe((res)=>{
    //                 //console.log(`active remove ok`,res);
    //                 this.updateEvent();
    //             });
    //     }
    //     //console.log(this.activeVenue);

    // }





    // // TICKETS
   







    // #################################################################################



    // aboutComplete(event:EventCreateModel){
    //     console.log(`about complete`, event);
    //     event.account_id = this.accountId;

    //     if(this.isNewEvent){
    //                   console.log(`new event`);             
    //                   this.main.eventService.CreateEvent(event)
    //                   .subscribe((res)=>{
                                   
    //                       this.isNewEvent = false;
    //                       event.id = res.id;                    
    //                       this.main.eventService.UpdateEvent(event)
    //                       .subscribe((res)=>{          
    //                                this.Event = res;
                                 
    //                               this.currentPage = 'artist';
    //                           },
    //                           (err)=>{
    //                               console.log(`err`,err);
    //                           }
    //                   );

    //                   },
    //                   (err)=>{
    //                       //console.log(`err`,err);
    //                   }
    //                   );
    //               }
    //     else{
    //             this.main.eventService.UpdateEvent(event)
    //                 .subscribe((res)=>{
    //                         console.log(`update event`);
    //                         this.Event = res;
    //                         console.log(`create`,res);
    //                         this.currentPage = 'artist';
    //                     },
    //                     (err)=>{
    //                         console.log(`err`,err);
    //                     }
    //             );
    //         }
    //     }
    
    // // TICKETS
    // getTickets(){
    //     // console.log(`getTickets`);
    //     this.tickets = [];
    //     let params:TicketGetParamsModel = new TicketGetParamsModel();
    //     params.account_id = this.Event.creator_id;
    //     params.event_id = this.Event.id;
       
    //     for(let t of this.Event.tickets){
    //         params.id = t.id;
    //         this.main.eventService.GetTickets(params).
    //             subscribe((res:TicketModel)=>{
    //                 this.tickets.push(res);
    //                 this.currentTicket = this.tickets[0];
    //             }); 
    //     }
        
    // }

    

    // artistComplete(){
    //     this.currentPage = 'venue';
    // }

    // venueComplete(){
    //     this.currentPage = 'funding';
    // }

    // fundingComplete(){
    //     this.currentPage = 'tickets';
    // }



}

export enum Pages {
    about = 0,
    artist = 1,
    venue = 2,
    funding = 3,
    tickets = 4
}
