import { Component, OnInit, NgZone, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges } from '@angular/core';
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
import { FormGroup, FormControl } from '@angular/forms';
import { AccountAddToEventModel } from '../../../core/models/artistAddToEvent.model';
import { AccountSearchModel } from '../../../core/models/accountSearch.model';
import { GenreModel } from '../../../core/models/genres.model';
import { CheckModel } from '../../../core/models/check.model';
import { InboxMessageModel } from '../../../core/models/inboxMessage.model';
import { EventCreateModel } from '../../../core/models/eventCreate.model';
import { BaseImages } from '../../../core/base/base.enum';


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


  isAcceptedArtistShow:boolean = true;
  showModalRequest:boolean = false;

  requestArtistForm : FormGroup = new FormGroup({
    "time_frame": new FormControl(""),
    "is_personal": new FormControl(""),
    "estimated_price": new FormControl(""),
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


    ngOnInit() {
      this.CreateAutocompleteArtist();
      this.artistSearchParams.price_to = 100000;
      let _the = this;
      var hu_2 = $(".current-slider").ionRangeSlider({
          min: 1,
          max: 100000,
          from: 100000,
          step: 10,
          type: "single",
          hide_min_max: false,
          prefix: "$ ",
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
          if(acc.image_id){
            this.main.imagesService.GetImageById(acc.image_id).
              subscribe((img)=>{
                if(img.base64)
                  acc.image_base64_not_given = img.base64;
                else
                  acc.image_base64_not_given = '../../../../assets/img/non-photo-2.svg';
                this.Artists.push(acc);
              })
          }
          else {
            acc.image_base64_not_given = '../../../../assets/img/non-photo-2.svg';
            this.Artists.push(acc);
          }
        })
    }
  }

  artistSearch($event?:string){

    let copy = this.artistsSearch;
    this.artistsSearch = [];
    if($event) this.artistSearchParams.text = $event;

    this.isLoadingArtist = true;
    this.artistSearchParams.type = 'artist';

    this.artistSearchParams.genres = [];

    for(let g of this.genresSearchArtist)
      if(g.checked) this.artistSearchParams.genres.push(g.genre);

    this.artistSearchParams.exclude_event_id = this.Event.id;

  this.main.accService.AccountsSearch(this.artistSearchParams).subscribe(
    (res)=>{
      console.log(this.artistSearchParams,` from back `, res);
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
        this.main.imagesService.GetImageById(a.object.image_id)
          .subscribe((img)=>{
            if(img.base64)
              a.object.image_base64_not_given = img.base64;
            else
              a.object.image_base64_not_given = '../../../../assets/img/non-photo-2.svg';
          });
        }
      else a.object.image_base64_not_given = '../../../../assets/img/non-photo-2.svg';
    }
  }

  artistOpenMapModal(){
    $('#modal-map-2').modal('show');
    
      $('#modal-pick-artist').modal('hide');
    $('#modal-map-2').on("hidden.bs.modal", function () {
      $('#modal-pick-artist').modal('show');
    });
    this.agmMap.triggerResize();
  }

  closeAddArtist(id:number){
    console.log(`click`);
    $('#modal-pick-artist').modal('toggle');
    setTimeout(() => {
      // this.router.navigate(['/system/profile',id]);
    }, 150);
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
    $('#modal-pick-artist').modal('toggle');
      let step = 1;
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

              }, (err)=>{
                this.onError.emit(this.getResponseErrorMessage(err, 'event'));
               // console.log(`err`,err);

              });

          }

        }

      }
      setTimeout(() => {
        this.updateEvent();
      }, 1000);


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

     console.log(this.ownerAcceptDecline);
    this.main.eventService.ArtistAcceptOwner(this.ownerAcceptDecline).
        subscribe((res)=>{
           // console.log(`ok accept artist`,res);
            this.onError.emit("Artist accepted!");
            this.updateEvent();
        },(err)=>{
          if(err.status === 422)
            this.onError.emit("Limit of artists was reached!");
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
  this.showModalRequest = true;
    setTimeout(() => {
      $('#modal-send-request-artist').modal('show');
    }, 50);

   this.artistForRequest = artist;
}





artistSendRequest(id:number){
  for (let key in this.requestArtistForm.value) {
      if (this.requestArtistForm.value.hasOwnProperty(key)) {
          this.addArtist[key] = this.requestArtistForm.value[key];
      }
  }
  this.addArtist.event_id = this.Event.id;
  this.addArtist.account_id = this.Event.creator_id;
  this.addArtist.id = id;
  //console.log(`request artist`,this.addArtist);

  this.main.eventService.ArtistSendRequest(this.addArtist)
  .subscribe((send)=>{
      $('#modal-send-request-artist').modal('toggle');
     // console.log(`send`);
      this.onError.emit("Request was sent!");

      this.updateEvent();
  })
}

updateEvent(){

  console.log(`updateEvent`);
  this.main.eventService.GetEventById(this.Event.id).
            subscribe((res:EventGetModel)=>{
              //  console.log(`updateEventThis`);
                this.Event = this.main.eventService.EventModelToCreateEventModel(res);
                this.artistsList = [];
                this.artistsList = this.Event.artist;
            //    console.log(`---`,this.Event,this.artistsList)
                this.GetArtistsFromList();

  })

}

getMessages(){
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

getIdAtMsg(sender:number){
  for(let m of this.messagesList){
    console.log(`m`,m,sender,this.Event.creator_id);
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


}
