import { Component, OnInit, NgZone, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges, HostListener } from '@angular/core';
import { AuthMainService } from '../../../core/services/auth.service';
import { AccountService } from '../../../core/services/account.service';
import { ImagesService } from '../../../core/services/images.service';
import { TypeService } from '../../../core/services/type.service';
import { GenresService } from '../../../core/services/genres.service';
import { EventService } from '../../../core/services/event.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'angular2-social-login';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { Http } from '@angular/http';
import { BaseComponent } from '../../../core/base/base.component';
import { GetArtists, EventGetModel } from '../../../core/models/eventGet.model';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountAddToEventModel } from '../../../core/models/artistAddToEvent.model';
import { AccountSearchModel } from '../../../core/models/accountSearch.model';
import { GenreModel } from '../../../core/models/genres.model';
import { CheckModel } from '../../../core/models/check.model';
import { InboxMessageModel } from '../../../core/models/inboxMessage.model';
import { EventCreateModel } from '../../../core/models/eventCreate.model';
import { BaseImages } from '../../../core/base/base.enum';
import { CurrencyIcons, Currency} from '../../../core/models/preferences.model';


declare var $:any;
declare var ionRangeSlider:any;

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent extends BaseComponent implements OnInit {



  @Input() Event:EventCreateModel;
  @Output() onSaveEvent:EventEmitter<EventCreateModel> = new EventEmitter<EventCreateModel>();
  @Output() onError:EventEmitter<string> = new EventEmitter<string>();
  @Output() openPreview = new EventEmitter<number>();
  @ViewChild('searchArtist') public searchElementArtist: ElementRef;
  @ViewChild('agmMap') agmMap : AgmMap;

  artistsList: GetArtists[] = [];
  Artists:AccountGetModel[] = [];
  artistForRequest:AccountGetModel = new AccountGetModel();
  addArtist:AccountAddToEventModel = new AccountAddToEventModel();
  isLoadingArtist:boolean = false;

  artistSearchParams:AccountSearchModel = new AccountSearchModel();
  genresSearchArtist:GenreModel[] = []; // список жанров для поиска артистов
  artistsSearch:CheckModel<AccountGetModel>[] = []; // артисты, которые удовлятворяют поиску

  mapCoords =  {lat:55.755826, lng:37.6172999};

  CurrencySymbol = '';
  currency ='';
  maxValue = 100000;
  postfix = '';
  prefix = '';
  isEng: boolean;
  isAcceptedArtistShow:boolean = true;
  // showModalRequest:boolean = false;
  
  requestArtistForm : FormGroup = new FormGroup({
    "time_frame_range": new FormControl("",[Validators.required]),
    "time_frame_number": new FormControl("",[Validators.required]),
    "is_personal": new FormControl(""),
    "estimated_price": new FormControl("",[Validators.required]),
    "message": new FormControl("")
});

    ownerAcceptDecline = {
      event_id:0,
      id:0,
      message_id:0,
      account_id:0,
      datetime_from:'',
      datetime_to:''
    }

    messagesList:InboxMessageModel[] = [];

    isShowMap = false;

    ESCAPE_KEYCODE = 27;
    ENTER_KEYCODE = 13;
  
    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if(this.isShowMap){
            if (event.keyCode === this.ESCAPE_KEYCODE || event.keyCode === this.ENTER_KEYCODE) {
              $('#modal-map-2').modal('hide');
              this.isShowMap = false;
            }
        }
    }


    ngOnInit() {
      
    this.CurrencySymbol = CurrencyIcons[this.Event.currency];
      
      this.isEng = this.isEnglish();
      this.CreateAutocompleteArtist();
      this.artistSearchParams.price_to = 100000;
      let _the = this;
      var hu_2 = $(".current-slider").ionRangeSlider({
          min: 1,
          max: this.maxValue,
          from: this.maxValue,
          step: 10,
          type: "single",
          hide_min_max: false,
          prefix: _the.CurrencySymbol+" ",
          grid: false,
          prettify_enabled: true,
          prettify_separator: ',',
          grid_num: 5,
          onFinish: function (data) {
              _the.PriceArtistChanged(data);
          }
      });

      this.getGenres();
      
      // this.artistsList = this.Event.artist;
      // //console.log(this.artistsList);
      // this.GetArtistsFromList();
    }

    ngOnChanges(){
      

      // this.artistsList = this.Event.artist;
      // //console.log(this.artistsList);
      // this.GetArtistsFromList();
      // console.log(`ngOnChanges`,this.artistsList, this.Artists);
      this.updateEvent();
    }
    getSliderParametres(){
      if(this.CurrencySymbol == "$"){
        this.maxValue = 100000;
        this.postfix = "";
        this.prefix = "$ ";
        
      }
      else if(this.CurrencySymbol == "₽"){
        this.maxValue = 1000000;
        this.postfix = " ₽";
        this.prefix = "";
        
      }
      else {
        this.maxValue = 100000;
        this.postfix = " €";
        this.prefix = "";
        
      }
      
    }

    getGenres(){
      this.genresSearchArtist = [];
      this.main.genreService.GetAllGenres()
      .subscribe((res:string[])=>{
        this.genresSearchArtist = this.main.genreService.StringArrayToGanreModelArray(res);
          for(let i of this.genresSearchArtist) {
            i.show = true;}
      });
    }

    isPriceSearch = false;
    PriceArtistChanged(data:any){
          setTimeout(() => {
            this.artistSearchParams.price_to = data.from;
            this.artistSearch();
          }, 200);
    }

    Init(event?:EventCreateModel)
    {
     
    }



  CreateAutocompleteArtist(){
    this.mapsAPILoader.load().then(
        () => {

         let autocomplete = new google.maps.places.Autocomplete(this.searchElementArtist.nativeElement, {types:[`(cities)`]});


            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    if(place.geometry === undefined || place.geometry === null )
                    {
                        return;
                    }
                    else
                    {
                         this.artistSearchParams.address = autocomplete.getPlace().formatted_address;

                         this.mapCoords.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                         this.mapCoords.lng = autocomplete.getPlace().geometry.location.toJSON().lng;

                         this.artistSearch();
                    }
                });
            });
        }
    );
  }

  GetArtistsFromList(){
    this.Artists = [];
    if(this.artistsList&&this.artistsList.length>0)
    for(let i of this.artistsList){
      this.main.accService.GetAccountById(i.artist_id)
        .subscribe((acc:AccountGetModel)=>{
          this.getMessages();
          acc.status_not_given = i.status;
        
          if(i.agreement&&i.agreement.price)
            acc.price_not_given = i.agreement.price;
          else if(i.price){
             acc.price_not_given = i.price;
          }
          else if(i.approximate_price){
            acc.price_not_given = i.approximate_price;
          }
          else{
            acc.price_not_given = 0;
          }

          acc.message_id = i.message_id;

          if(acc.image_id){
            acc.image_base64_not_given = this.main.imagesService.GetImagePreview(acc.image_id,{width:240,height:240});
            
            //console.log(acc.image_base64_not_given);
            // this.main.imagesService.GetImageById(acc.image_id).
            //   subscribe((img)=>{
            //     if(img.base64)
            //       acc.image_base64_not_given = img.base64;
            //     else
            //       acc.image_base64_not_given = '../../../../assets/img/non-photo-2.svg';
            //     this.Artists.push(acc);
            //   })
          }
          else {
            acc.image_base64_not_given = '../../../../assets/img/non-photo-2.svg';
            // this.Artists.push(acc);
          }
          this.Artists.push(acc);
        })
    }
  }

  artistSearch($event?:string){

    let copy = this.artistsSearch;
    this.artistsSearch = [];
    
    if($event||$event==='') 
      this.artistSearchParams.text = $event;

    this.isLoadingArtist = true;
    this.artistSearchParams.type = 'artist';

    this.artistSearchParams.genres = [];

    for(let g of this.genresSearchArtist)
      if(g.checked) this.artistSearchParams.genres.push(g.genre);

    this.artistSearchParams.exclude_event_id = this.Event.id;

  this.main.accService.AccountsSearch(this.artistSearchParams).subscribe(
    (res)=>{
       //console.log(this.artistSearchParams,` from back `, res);
      let temp = this.convertArrToCheckModel<AccountGetModel>(res);

      for(let art of copy){
        if(art.checked){
          let isFind = false;

          for(let t of temp)
            if(t.object.id==art.object.id){
              t.checked = art.checked;
              isFind = true;
              break;
            }
          if(!isFind) temp.push(art);
        }
      }

      this.artistsSearch = [];
      this.artistsSearch = temp;
      this.isLoadingArtist = false;
      this.GetArtistsImages();
     // console.log(this.artistsSearch);
    },(err)=>{ this.isLoadingArtist = false;})

    }

    textChange(str:string){
      if(str==''){
        this.artistSearchParams.text = '';
        this.artistSearch();
      }
    }

    pressEnter(event){
      if(event.key=="Enter")
        this.artistSearch();
    }

    addressChange(str:string){
      if(str==''){
        this.artistSearchParams.address = '';
        this.artistSearch();
      }
    }

  GetArtistsImages(){
    for(let a of this.artistsSearch){
      if(a.object.image_id){
        a.object.image_base64_not_given = this.main.imagesService.GetImagePreview(a.object.image_id,{width:140,height:140});
        // this.main.imagesService.GetImageById(a.object.image_id)
        //   .subscribe((img)=>{
        //     if(img.base64)
        //       a.object.image_base64_not_given = img.base64;
        //     else
        //       a.object.image_base64_not_given = '../../../../assets/img/non-photo-2.svg';
        //   });
        }
      else a.object.image_base64_not_given = '../../../../assets/img/non-photo-2.svg';
    }
  }

  artistOpenMapModal(){
    $('#modal-map-2').modal('show');
    this.isShowMap = true;
    
      $('#modal-pick-artist').modal('hide');
    $('#modal-map-2').on("hidden.bs.modal", function () {
      $('#modal-pick-artist').modal('show');
    });
    this.agmMap.triggerResize();
  }

  closeAddArtist(id:number){
    // console.log(`click`);
    $('#modal-pick-artist').modal('toggle');
    setTimeout(() => {
      // this.router.navigate(['/system/profile',id]);
    }, 150);
    this.openPreview.emit(id);

  }

  openPreviewArtist(id:number){
    this.openPreview.emit(id);
  }

  openArtist(id:number){

    this.router.navigate(['/system','profile',id]);
    // this.openPreview.emit(id);
  }

  addNewArtistOpenModal(){
    $('#modal-pick-artist').modal('show');

  }

  checkArtist(acc:CheckModel<AccountGetModel>){
    acc.checked = !acc.checked;
  }

  addNewArtist(){
    this.addArtist.event_id = this.Event.id;
    this.addArtist.account_id = this.Event.creator_id;
    this.addArtist.currency = this.Event.currency;

    $('#modal-pick-artist').modal('toggle');
      let step = 1;
      let itemCount = 0;
      for(let item of this.artistsSearch){
        if(item.checked){
          let isFind = false;
          for(let art of this.Artists){
            if(art.id == item.object.id)
              isFind = true;
          }
          if(!isFind){
            this.addArtist.artist_id = item.object.id;
           // console.log(this.addArtist);
            this.main.eventService.AddArtist(this.addArtist).
              subscribe((res)=>{
                //  console.log(`add `,this.addArtist.artist_id);
                itemCount++;
                console.log(itemCount,this.artistsSearch.length)
                if(itemCount===this.artistsSearch.length){
                setTimeout(() => {
                          console.log(`update`);
                          this.updateEvent();
                        }, 500);
                }

              }, (err)=>{
                this.onError.emit(this.getResponseErrorMessage(err, 'event'));
               // console.log(`err`,err);

              });

          } else {
            itemCount++;
          }
        }
        else{
          itemCount++;
        }
        if(itemCount===this.artistsSearch.length){
            setTimeout(() => {
                    console.log(`update`);
                    this.updateEvent();
                  }, 500);
        }

      }
     


  }



  acceptArtistCard(card:AccountGetModel){

    this.ownerAcceptDecline.account_id = this.main.CurrentAccount.id;
    this.ownerAcceptDecline.id = card.id;
    this.ownerAcceptDecline.event_id = this.Event.id;
    
    let msgId = this.getIdAtMsg(card.id);

    
    this.ownerAcceptDecline.message_id = msgId;
     let msg = this.messagesList[0];

    for(let m of this.messagesList)
        if(m.id == msgId) msg = m;
    
    // console.log(msg,this.messagesList,msgId);    
    this.ownerAcceptDecline.datetime_from = msg.message_info.preferred_date_from?msg.message_info.preferred_date_from:new Date().toString();
    this.ownerAcceptDecline.datetime_to =  msg.message_info.preferred_date_to?msg.message_info.preferred_date_to:new Date('+3').toString();

    //  console.log(this.ownerAcceptDecline);
    this.main.eventService.ArtistAcceptOwner(this.ownerAcceptDecline).
        subscribe((res)=>{
           // console.log(`ok accept artist`,res);
            this.onError.emit("Artist accepted!");
            this.updateEvent();
        },(err)=>{
          if(err.status === 422){
            this.onError.emit(err.json()['errors']?err.json()['errors']:"Limit of artists was reached!");
            }
          else
            this.onError.emit("Artist NOT accepted!");
        });

}


declineArtist(card:AccountGetModel){

  this.ownerAcceptDecline.account_id = this.main.CurrentAccount.id;
  this.ownerAcceptDecline.id = card.id;
  this.ownerAcceptDecline.event_id = this.Event.id;

  let msgId = this.getIdAtMsg(card.id);
  this.ownerAcceptDecline.message_id = msgId;

   let msg = this.messagesList[0];
  for(let m of this.messagesList)
      if(m.id == msgId) msg = m;

      this.ownerAcceptDecline.datetime_from = msg.message_info.preferred_date_from?msg.message_info.preferred_date_from:new Date().toString();
      this.ownerAcceptDecline.datetime_to =  msg.message_info.preferred_date_to?msg.message_info.preferred_date_to:new Date('+3').toString();

  //console.log(`dicline`,this.ownerAcceptDecline);
  this.main.eventService.ArtistDeclineOwner(this.ownerAcceptDecline).
      subscribe((res)=>{
         // console.log(`ok decline artist`,res);
          this.onError.emit("Artist declined!");
          this.updateEvent();
          this.isEmptyDeclinedArtists();
      },(err)=>{
        this.onError.emit("Artist NOT declined!");
      });

}



sendArtistRequestOpenModal(artist:AccountGetModel){
  // this.showModalRequest = true;
    setTimeout(() => {
      $('#modal-send-request-artist').modal('show');
    }, 50);

   this.artistForRequest = artist;
}





artistSendRequest(id:number){
  if(!this.requestArtistForm.invalid){
    for (let key in this.requestArtistForm.value) {
        if (this.requestArtistForm.value.hasOwnProperty(key)) {
            this.addArtist[key] = this.requestArtistForm.value[key];
        }
    }
    this.addArtist.event_id = this.Event.id;
    this.addArtist.account_id = this.Event.creator_id;
    this.addArtist.id = id;
    this.addArtist.currency = this.Event.currency;
    // console.log(`request artist`,this.addArtist);

    this.main.eventService.ArtistSendRequest(this.addArtist)
    .subscribe((send)=>{
        $('#modal-send-request-artist').modal('hide');
      // console.log(`send`);
      setTimeout(() => {
        this.onError.emit("Request was sent!");
      }, 400);
        
      setTimeout(() => {
        this.updateEvent();
      }, 200);
        
    })
  }
  else{
    this.onError.emit(this.getFormErrorMessage(this.requestArtistForm,'request'));
  }
}

updateEvent(){

  // console.log(`updateEvent`);
  this.main.eventService.GetEventById(this.Event.id).
            subscribe((res:EventGetModel)=>{
              this.artistsList = [];
              //  console.log(`updateEventThis`);
                this.Event = this.main.eventService.EventModelToCreateEventModel(res);
                  this.artistsList = this.Event.artist;
                setTimeout(() => {
                
                  console.log(`---`,this.Event,this.artistsList)
                  this.GetArtistsFromList();
                }, 500);
               

  })

}

getMessages(){
  if(this.Event.creator_id){
    let crId = this.Event.creator_id;
    this.messagesList = [];
    this.main.accService.GetInboxMessages(crId).
      subscribe((res)=>{
          for(let m of res)
          this.main.accService.GetInboxMessageById(crId, m.id).
              subscribe((msg)=>{
                  this.messagesList.push(msg);
                  // console.log(`msg`,this.messagesList);
          });
          },(err)=>{
        //console.log(err)
      });
  }
}

getPriceAtMsg(sender:number){

  for(let m of this.messagesList){
      if( m.sender_id == sender &&
          m.receiver_id == this.Event.creator_id &&
          m.message_info&& m.message_info.event_info&&
          m.message_info.event_info.id == this.Event.id){
            if(m.message_type=='request')
              return m.message_info.estimated_price;
            else
             return m.message_info.price;
      }
  }
  return '-';
}

getCurrencyAtMsg(sender:number){
  for(let m of this.messagesList){
    if( m.sender_id == sender &&
        m.receiver_id == this.Event.creator_id &&
        m.message_info&& m.message_info.event_info&&
        m.message_info.event_info.id == this.Event.id){
           return m.message_info.currency;
    }
}
return '-';
}

getIdAtMsg(sender:number){
  for(let m of this.messagesList){
    // console.log(`m`,m,sender,this.Event.creator_id);
      if( m.sender_id == sender &&
          m.receiver_id == this.Event.creator_id &&
          m.message_info && m.message_info.event_info &&
          m.message_info.event_info.id == this.Event.id){
             return m.id;
      }
  }
}

artistComplete(){
  this.onSaveEvent.emit(this.Event);
}




dragMarker($event)
    {
        this.mapCoords.lat = $event.coords.lat;
        this.mapCoords.lng = $event.coords.lng;
        this.codeLatLng( this.mapCoords.lat, this.mapCoords.lng);
    }

    setMapCoords(event){
        this.mapCoords = {lat:event.coords.lat,lng:event.coords.lng};
        this.codeLatLng( this.mapCoords.lat, this.mapCoords.lng);
    }

    codeLatLng(lat, lng) {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode(
            {'location': latlng },
            (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[1]) {

                        $("#artistAddress").val(results[1].formatted_address);
                        this.artistSearchParams.address = results[1].formatted_address;
                        this.artistSearch();
                    }
                    else {
                    // alert('No results found');
                    }
                }
                else {
                    // alert('Geocoder failed due to: ' + status);
                }
            }
        );

    }

    niceViewName(obj:AccountGetModel){
      if(obj.stage_name)
        return obj.stage_name.length>20?obj.stage_name.slice(0,18)+'..':obj.stage_name;
      else if(obj.display_name)
        return obj.display_name.length>20?obj.display_name.slice(0,18)+'..':obj.display_name;
      else if(obj.user_name)
        return obj.user_name.length>20?obj.user_name.slice(0,18)+'..':obj.user_name;
    }

    niceViewGenres(g:string[]){
      let gnr = '';
      if(g){
          if(g[0]) gnr+=g[0].replace('_',' ');
          if(g[1]) gnr+=', '+g[1].replace('_',' ');
      }

     return gnr;
    }


    isEmptyDeclinedArtists(){
      for(let a of this.Artists)
        if(a.status_not_given=='owner_declined'||a.status_not_given=='declined')
          return false;
      return true;
    }


    ArtistInvite = {
      account_id: this.CurrentAccount.id,
      name:'',
      email:'',
      facebook:'',
      twitter:'',
      vk:'',
      youtube:''
    }

    InviteSocials = {
      facebook: false,
      vk: false,
      twitter: false,
      youtube: false
    }


    openInvite(){
       $('#modal-send-unauth').modal('show');
    }

    inviteArtist(){
      
      if(this.ArtistInvite.name){
        for(let i in this.InviteSocials){
          if(!this.InviteSocials[i]){
            this.ArtistInvite[i] = null
          }
          else{
            if(!this.ArtistInvite[i])
              {
                this.onError.emit('Please, fill social ('+i+') username!');
                return;
              }
          }
        }

        console.log(this.ArtistInvite, this.InviteSocials);
        this.main.inviteService.PostInviteArtist(this.ArtistInvite)
          .subscribe(
            (res)=>{
              console.log(`ok`);
              $('#modal-send-unauth').modal('hide');
               this.ArtistInvite = {
                account_id: this.CurrentAccount.id,
                name:'',
                email:'',
                facebook:'',
                twitter:'',
                vk:'',
                youtube:''
              }
              this.InviteSocials = {
                facebook: false,
                vk: false,
                twitter: false,
                youtube: false
              }
            },
            (err)=>{
              this.onError.emit(this.getResponseErrorMessage(err, 'event'));
            }
          )
      }
      else {
        this.onError.emit('Please, fill name field!');
      }
    }

}
