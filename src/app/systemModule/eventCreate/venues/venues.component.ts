import { Component, OnInit, Input, Output, ViewChild, EventEmitter, NgZone, ElementRef, SimpleChanges, HostListener } from '@angular/core';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { AuthMainService } from '../../../core/services/auth.service';
import { AccountService } from '../../../core/services/account.service';
import { ImagesService } from '../../../core/services/images.service';
import { TypeService } from '../../../core/services/type.service';
import { GenresService } from '../../../core/services/genres.service';
import { EventService } from '../../../core/services/event.service';
import { BaseComponent } from '../../../core/base/base.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'angular2-social-login';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { Http } from '@angular/http';
import { GetVenue, EventGetModel } from '../../../core/models/eventGet.model';
import { AccountSearchModel } from '../../../core/models/accountSearch.model';
import { CheckModel } from '../../../core/models/check.model';
import { SelectModel } from '../../../core/models/select.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountAddToEventModel } from '../../../core/models/artistAddToEvent.model';
import { InboxMessageModel } from '../../../core/models/inboxMessage.model';
import { EventCreateModel } from '../../../core/models/eventCreate.model';
import { BaseImages, BaseErrors, BaseMessages } from '../../../core/base/base.enum';
import { CurrencyIcons } from '../../../core/models/preferences.model';
import { } from 'googlemaps';

declare var $:any;
declare var ionRangeSlider:any;

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.css']
})
export class VenuesComponent extends BaseComponent implements OnInit {


    @Input() Event:EventCreateModel;
    @Output() onSaveEvent:EventEmitter<EventCreateModel> = new EventEmitter<EventCreateModel>();
    @Output() onSave:EventEmitter<EventCreateModel> = new EventEmitter<EventCreateModel>();
    @Output() onError:EventEmitter<string> = new EventEmitter<string>();
    @Output() openPreview = new EventEmitter<number>();

    @ViewChild('searchVenue') public searchElementVenue: ElementRef;
    @ViewChild('agmMap') agmMap : AgmMap;

    venuesList: GetVenue[] = [];
    isAcceptedVenueShow:boolean = true;
    isPrivateVenue:boolean = false;
    Venues:AccountGetModel[] = [];
    venueList:CheckModel<AccountGetModel>[] = [];

    mapCoords =  {lat:55.755826, lng:37.6172999};
    isLoadingVenue:boolean = false;

    CurrencySymbol = '';
    currency ='';
    maxValue = 100000;
    postfix = '';
    prefix = '';

    venueSearchParams:AccountSearchModel = new AccountSearchModel();
    typesSpace:CheckModel<SelectModel>[] = [];

    isHaveDeclined = false;

    //venueShowsList:AccountGetModel[] = [];
    requestVenues:AccountGetModel[] = []; // список тех, кому отправлен запрос, брать из Event
    requestVenueForm : FormGroup = new FormGroup({
        "time_frame_range": new FormControl("",[Validators.required]),
        "time_frame_number": new FormControl("",[Validators.required]),
        "is_personal": new FormControl(""),
        "estimated_price": new FormControl("",[Validators.required]),
        "message": new FormControl("")
    });
    addVenue:AccountAddToEventModel = new AccountAddToEventModel();
    eventForRequest:AccountGetModel = new AccountGetModel();
    messagesList:InboxMessageModel[] = [];

    ownerAcceptDecline = {
        event_id:0,
        id:0,
        message_id:0,
        account_id:0,
        datetime_from:'',
        datetime_to:'',
        additional_text:'',
        reason:''
    }

    isShowMap = false;

    ESCAPE_KEYCODE = 27;
    ENTER_KEYCODE = 13;

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if(this.isShowMap){
            if (event.keyCode === this.ESCAPE_KEYCODE || event.keyCode === this.ENTER_KEYCODE) {
              $('#modal-map-3').modal('hide');
              this.isShowMap = false;
            }
        }
    }

    ngOnInit() {

        this.CurrencySymbol = CurrencyIcons[this.Event.currency];

        this.CreateAutocompleteVenue();
        this.getSliderParametres();
        this.initSlider()
        this.getAllSpaceTypes();

        this.GetLocation();

        this.venuesList = this.Event.venues;

        this.main.eventService.GetEventById(this.Event.id).
        subscribe((res:EventGetModel)=>{
           this.venuesList = [];
           setTimeout(() => {
                this.Event = this.main.eventService.EventModelToCreateEventModel(res);
                this.venuesList = this.Event.venues;
                // this.onSave.emit(this.Event);
                this.GetVenueFromList();
                this.venueSearch();
           }, 300);
        })
    }

    GetLocation(){
      this.main.accService.GetLocation()
        .subscribe((data)=>{
            this.mapCoords.lat = data.location[0];
            this.mapCoords.lng = data.location[1];
        })
    }

    // ngOnChanges(change:SimpleChanges){
    //     // if(change.Event){
    //     //     this.Event = change.Event.currentValue;
    //     //     this.venuesList = this.Event.venues;
    //     //     this.GetVenueFromList();
    //     // }
    // }


    initSlider(){

        this.venueSearchParams.capacity_to = 100000;
        this.venueSearchParams.price_to = 100000;
        let _the = this;

        let _max = this.Event.currency==='RUB'?this.maxValue=650000:null;
        var hu_3 = $(".current-slider-price-venue").ionRangeSlider({
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
                _the.VenuePriceChanged(data);
            }
        });

        var hu_4 = $(".current-slider-capacity-venue").ionRangeSlider({
            min: 1,
            max: 100000,
            from: 100000,
            step: 10,
            type: "single",
            hide_min_max: false,

            grid: false,
            prettify_enabled: true,
            prettify_separator: ',',
            grid_num: 5,
            onFinish: function (data) {
                _the.VenueCapacityChanged(data);
            }
        });

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

    GetVenueFromList(){
        this.requestVenues = [];
        if(this.venuesList&&this.venuesList.length>0)
        for(let i of this.venuesList){
        this.main.accService.GetAccountById(i.venue_id)
            .subscribe((acc:AccountGetModel)=>{
            this.getMessages();
            acc.status_not_given = i.status;
            acc.date_not_given = i.created_at;
          if(i.status==='owner_declined'){
                      acc.reason = i.reason;
                      acc.reason_text = i.reason_text;
                    }


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

        //   acc.message_id = i.message_id;


            if(acc.image_id){

                // acc.image_base64_not_given = this.main.imagesService.GetImagePreview(acc.image_id,{width:240,height:240});
                // this.requestVenues.push(acc);


                this.main.imagesService.GetImageById(acc.image_id).
                subscribe((img)=>{
                    if(img.base64)
                    acc.image_base64_not_given = this.main.imagesService.GetImagePreview(acc.image_id,{width:240,height:240});
                    else
                        acc.image_base64_not_given = '../../../../assets/img/show.png';
                    this.requestVenues.push(acc);
                    this.isEmptyDeclinedArtists();
                },(err)=>{
                    acc.image_base64_not_given = '../../../../assets/img/show.png';
                })


                // this.main.imagesService.GetImageById(acc.image_id).
                // subscribe((img)=>{
                //     if(img.base64)
                //         acc.image_base64_not_given = img.base64;
                //     else
                //         acc.image_base64_not_given = '../../../../assets/img/show.png';
                //     this.requestVenues.push(acc);
                // })
            }
            else {
                acc.image_base64_not_given = '../../../../assets/img/show.png';
                this.requestVenues.push(acc);
                this.isEmptyDeclinedArtists();
                }
            });
        }
    }

    getMessages(id?:number){
        let crId = id?id:this.Event.creator_id;
        this.messagesList = [];
        if(crId)
        this.main.accService.GetInboxMessages(crId).
        subscribe((res)=>{

            for(let m of res)
            this.main.accService.GetInboxMessageById(crId, m.id).
                subscribe((msg)=>{
                    this.messagesList.push(msg);
            });
        },
        (err)=>{
        });
    }

    getPriceAtMsg(sender:number){
        for(let m of this.messagesList){
            if( m.sender_id == sender &&
                m.receiver_id == this.Event.creator_id &&
                m.message_info&& m.message_info.event_info&&
                m.message_info.event_info.id == this.Event.id){
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
            if( m.sender_id == sender &&
                m.receiver_id == this.Event.creator_id &&
                m.message_info &&  m.message_info.event_info &&
                m.message_info.event_info.id == this.Event.id){
                   return m.id;
            }
        }
        return null;
    }

    VenuePriceChanged(data){
        this.venueSearchParams.price_to  = data.from;
        this.venueSearch();
    }

    VenueCapacityChanged(data){
        setTimeout(() => {
            this.venueSearchParams.capacity_to = data.from;
            this.venueSearch();
            }, 200);
    }

    getAllSpaceTypes(){
        let types:SelectModel[] = this.main.typeService.GetAllSpaceTypes();
        this.typesSpace = this.convertArrToCheckModel<SelectModel>(types);
    }

    CreateAutocompleteVenue() {
        this.mapsAPILoader.load().then(
            () => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementVenue.nativeElement, {types:[`(cities)`]});
                autocomplete.addListener("place_changed", () => {
                    this.ngZone.run(() => {
                        let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                        if(place.geometry === undefined || place.geometry === null )
                        {
                            return;
                        }
                        else
                        {
                            this.venueSearchParams.address = autocomplete.getPlace().formatted_address;
                            this.venueSearchParams.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                            this.venueSearchParams.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                             this.venueSearch();
                            this.mapCoords.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                            this.mapCoords.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                        }
                    });
                });
            }
        );
    }

    venueSearch($event?:string){
        this.venueList = [];
        this.isLoadingVenue = true;
        this.venueSearchParams.type = 'venue';
        if($event) this.venueSearchParams.text = $event;
        this.venueSearchParams.types_of_space = [];

        for(let space of this.typesSpace)
            if(space.checked) this.venueSearchParams.types_of_space.push(space.object.value)

        this.venueSearchParams.exclude_event_id = this.Event.id;

        this.main.accService.AccountsSearch(this.venueSearchParams).
             subscribe((res)=>{
                    let temp = this.convertArrToCheckModel<AccountGetModel>(res);

                    for(let art of this.venueList){
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

                    this.venueList = [];
                    this.venueList = temp;

                    this.isLoadingVenue = false;
                    this.GetVenuesImages();
        });
    }

    textChange(str:string){
        if(str==''){
          this.venueSearchParams.text = '';
          this.venueSearch();
        }
    }

    addressChange(str:string){
        if(str==''){
          this.venueSearchParams.address = '';
          this.venueSearch();
        }
    }

    GetVenuesImages(){
        for(let a of this.venueList){
          if(a.object.image_id){

            // a.object.image_base64_not_given = this.main.imagesService.GetImagePreview(a.object.image_id,{width:140,height:140});


            this.main.imagesService.GetImageById(a.object.image_id)
              .subscribe((img)=>{
                  if(img.base64)
                     a.object.image_base64_not_given = this.main.imagesService.GetImagePreview(a.object.image_id,{width:140,height:140});
                    else
                    a.object.image_base64_not_given = '../../../../assets/img/show.png';
              },(err)=>{
                a.object.image_base64_not_given = '../../../../assets/img/show.png';
            });


            // this.main.imagesService.GetImageById(a.object.image_id)
            //   .subscribe((img)=>{
            //       if(img.base64)
            //             a.object.image_base64_not_given = img.base64;
            //         else
            //         a.object.image_base64_not_given = '../../../../assets/img/show.png';
            //   });
            }
          else a.object.image_base64_not_given = '../../../../assets/img/show.png';
        }
    }


    addVenueCheck(venue:CheckModel<AccountGetModel>){
        venue.checked = !venue.checked;

        this.addVenue.event_id = this.Event.id;
        this.addVenue.venue_id = venue.object.id;
        this.addVenue.account_id = this.Event.creator_id;

        if(venue.object.capacity&&venue.object.capacity>0){
          this.main.eventService.AddVenue(this.addVenue).
                  subscribe((res)=>{
                      this.updateEvent();

                      // this.submitVenue();

              },(err)=>{
                  venue.checked = false;
                  if(err.json()['errors']==='HAS_ACCEPTED_VENUE')
                    this.onError.emit(this.GetTranslateString("Failed! This event has already confirmed a venue!"));
                  else
                    this.onError.emit(this.GetTranslateString("Request wasn't sent"))
              });
        }
    }


    pressEnter(event){
        if(event.key=="Enter")
            this.venueSearch();
    }



    addVenueById(id:number){
        if(!this.requestVenueForm.invalid){

            for (let key in this.requestVenueForm.value) {
                if (this.requestVenueForm.value.hasOwnProperty(key)) {
                    this.addVenue[key] = this.requestVenueForm.value[key];
                }
            }

            this.addVenue.estimated_price = +this.requestVenueForm.value['estimated_price'];

            this.addVenue.event_id = this.Event.id;
            this.addVenue.venue_id = id;
            this.addVenue.id = id;
            this.addVenue.account_id = this.Event.creator_id;
            this.addVenue.is_personal = true;
            this.addVenue.currency = this.Event.currency;

                    $('#modal-send-request-venue').modal('toggle');
                    this.main.eventService.VenueSendRequest(this.addVenue)
                     .subscribe((send)=>{
                      this.main.accService.onMessagesChange$.next();

                        this.onError.emit("Request was sent");
                         this.updateEvent();
                        //this.submitVenue();
                }, (err)=>{
                  this.onError.emit("Request wasn't sent")
                })
        }
        else {
            this.onError.emit(this.getFormErrorMessage(this.requestVenueForm,'request'));
        }
    }

    getStatusVenueEventById(id:number){
        for(let v of this.Event.venues)
            if(v.venue_id == id) return v.status;
        return 'not found artist';
    }

    acceptVenue(card:AccountGetModel){
        this.ownerAcceptDecline.account_id = this.Event.creator_id;
        this.ownerAcceptDecline.id = card.id;
        this.ownerAcceptDecline.event_id = this.Event.id;
        let msgId = this.getIdAtMsg(card.id);
        this.ownerAcceptDecline.message_id = msgId;
        let msg = this.messagesList[0];

        for(let m of this.messagesList)
            if(m.id == msgId) msg = m;

        this.ownerAcceptDecline.datetime_from = msg.message_info.preferred_date_from;
        this.ownerAcceptDecline.datetime_to =  msg.message_info.preferred_date_to;

        this.main.eventService.VenueAcceptOwner(this.ownerAcceptDecline).
            subscribe((res)=>{
                this.onError.emit("Venue accepted!");
                 this.updateEvent();
                //this.submitVenue();

            },(err)=>{
                if(err.json()['errors']==='Invalid date')
                  this.onError.emit("Venue NOT accepted! Invalid date");
                else if(err.json()['errors']==='ALREADY_HAS_VENUE')
                  this.onError.emit(this.GetTranslateString("Failed! This event has already confirmed a venue!"));
                else
                  this.onError.emit("Venue NOT accepted! "+this.getResponseErrorMessage(err));
            });
    }

    deleteVenue(card:AccountGetModel){
        this.ownerAcceptDecline.account_id = this.Event.creator_id;
        this.ownerAcceptDecline.id = card.id;
        this.ownerAcceptDecline.event_id = this.Event.id;
        let msgId = this.getIdAtMsg(card.id);
        this.ownerAcceptDecline.message_id = msgId;
        let msg = this.messagesList[0];

        for(let m of this.messagesList)
            if(m.id == msgId) msg = m;

        this.ownerAcceptDecline.datetime_from = msg.message_info.preferred_date_from;
        this.ownerAcceptDecline.datetime_to =  msg.message_info.preferred_date_to;

        this.main.eventService.VenueDeleteOwner
        (
          {
            account_id: this.Event.creator_id,
            id: card.id,
            event_id: this.Event.id
          }
        ).
            subscribe((res)=>{
                this.onError.emit("Venue deleted!");
                 this.updateEvent();
                //this.submitVenue();

            },(err)=>{
                if(err.json()['errors']==='Invalid date')
                  this.onError.emit("Venue NOT deleted! Invalid date");
                else if(err.json()['errors']==='ALREADY_HAS_VENUE')
                  this.onError.emit(this.GetTranslateString("Failed! This event has already confirmed a venue!"));
                else
                  this.onError.emit("Venue NOT deleted! "+this.getResponseErrorMessage(err));
            });
    }

  openDeclineModal(card:AccountGetModel){
    this.ownerAcceptDecline.account_id = this.Event.creator_id;
        this.ownerAcceptDecline.id = card.id;
        this.ownerAcceptDecline.event_id = this.Event.id;
        let msgId = this.getIdAtMsg(card.id);
        this.ownerAcceptDecline.message_id = msgId;
        let msg = this.messagesList[0];
        for(let m of this.messagesList)
            if(m.id == msgId) msg = m;

        // this.ownerAcceptDecline.datetime_from = msg&&msg.message_info&&msg.message_info.preferred_date_from?msg.message_info.preferred_date_from: new Date().toString();
        // this.ownerAcceptDecline.datetime_to =  msg&&msg.message_info&&msg.message_info.preferred_date_to? msg.message_info.preferred_date_to : new Date().toString();


      $('#modal-decline').modal('show');

  }

    declineVenue(){
      if(this.ownerAcceptDecline.reason){
        this.main.eventService.VenueDeclineOwner(this.ownerAcceptDecline).
            subscribe((res)=>{
                $('#modal-decline').modal('hide');
                this.onError.emit("Venue was declined!");
                this.updateEvent();
            },(err)=>{
                this.onError.emit("Venue was't declined!");
            });
      }
    }

    sendVenueRequestOpenModal(venue:AccountGetModel){
        $('#modal-send-request-venue').modal('show');
        this.eventForRequest = venue;
    }

    createPrivateRes(){
        this.onError.emit(BaseMessages.Success);
        this.updateEvent();
    }

    updateEvent(){
        this.main.eventService.GetEventById(this.Event.id).
        subscribe((res:EventGetModel)=>{
           this.venuesList = [];
           setTimeout(() => {
                this.Event = this.main.eventService.EventModelToCreateEventModel(res);
                this.venuesList = this.Event.venues;
                this.onSave.emit(this.Event);
                this.GetVenueFromList();
                this.venueSearch();
           }, 300);
        },(err)=>{
          this.onError.emit(this.getResponseErrorMessage(err,'venue'));
        })
    }


    submitVenue(){
        this.updateEvent();
        this.onSaveEvent.emit(this.Event);
    }

    venueOpenMapModal(){
        $('#modal-map-3').modal('show');
        this.isShowMap = true;
        setTimeout(() => {
            this.agmMap.triggerResize();
          }, 200);
    }


    openVenue(id:number){
        this.openPreview.emit(id);
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

                        $("#venueAddress").val(results[1].formatted_address);
                        this.venueSearchParams.address = results[1].formatted_address;
                        this.venueSearch();
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

    niceViewGenres(g:string[]){
        let gnr = '';
        if(g){
            if(g[0]) gnr+=g[0].replace('_',' ');
            if(g[1]) gnr+=', '+g[1].replace('_',' ');
        }

       return gnr;
    }

    niceViewGenre(g:string){

        let str = g.replace('_',' ').split(" ");

        for (var i = 0, x = str.length; i < x; i++) {
            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }

        return str.join(" ");
    }

    isEmptyDeclinedArtists(){
        this.isHaveDeclined = false;
        for(let a of this.requestVenues)
            if(a.status_not_given=='owner_declined'||a.status_not_given=='declined'){
                this.isHaveDeclined = true;
                return false;
            }

        // for(let a of this.venueShowsList)
        //     if(a.status_not_given=='owner_declined'||a.status_not_given=='declined')
        //         return false;

        return true;
    }

    getImageByUrl(id:number){

        this.main.imagesService.GetImagePreviewObservable(id,{width:20,height:20}).subscribe(
            (res)=>{
                return {'background-image':"url('"+this.main.imagesService.GetImagePreview(id,{width:240,height:240})+"')"}
            },
            (err)=>{
            }
        )
        //{'background-image': item.object.image_base64_not_given?'url('+item.object.image_base64_not_given+')':''}
    }


    VenueInvite = {
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

    inviteVenue(){

      if(this.VenueInvite.name){
        for(let i in this.InviteSocials){
          if(!this.InviteSocials[i]){
            this.VenueInvite[i] = null
          }
          else{
            if(!this.VenueInvite[i])
              {
                this.onError.emit('Please, fill social ('+i+') username!');
                return;
              }
          }
        }

        if(this.VenueInvite.email||this.VenueInvite.facebook||this.VenueInvite.vk||this.VenueInvite.twitter||this.VenueInvite.email){
          this.main.inviteService.PostInviteVenue(this.VenueInvite)
            .subscribe(
              (res)=>{
                $('#modal-send-unauth').modal('hide');
                this.VenueInvite = {
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
           this.onError.emit('Please, fill any link field!');
        }
      }
      else {
        this.onError.emit('Please, fill name field!');
      }
    }

    scrollToAdd(){
       window.scrollBy(0,-700)
    }

    OnError(error){
      this.onError.emit(error);
    }


}
