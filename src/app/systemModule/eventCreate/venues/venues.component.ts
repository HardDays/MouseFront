import { Component, OnInit, Input, Output, ViewChild, EventEmitter, NgZone, ElementRef, SimpleChanges } from '@angular/core';
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
import { FormGroup, FormControl } from '@angular/forms';
import { AccountAddToEventModel } from '../../../core/models/artistAddToEvent.model';
import { InboxMessageModel } from '../../../core/models/inboxMessage.model';
import { EventCreateModel } from '../../../core/models/eventCreate.model';
import { BaseImages, BaseErrors, BaseMessages } from '../../../core/base/base.enum';

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
   
    venueSearchParams:AccountSearchModel = new AccountSearchModel();
    typesSpace:CheckModel<SelectModel>[] = [];

    venueShowsList:AccountGetModel[] = [];
    requestVenues:AccountGetModel[] = []; // список тех, кому отправлен запрос, брать из Event
    requestVenueForm : FormGroup = new FormGroup({        
        "time_frame": new FormControl(""),
        "is_personal": new FormControl(""),
        "estimated_price": new FormControl(),
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
        datetime_to:''
    }

    ngOnInit() {
        this.CreateAutocompleteVenue();
        this.initSlider()
        this.getAllSpaceTypes();
        this.venuesList = this.Event.venues;
        this.GetVenueFromList();
    }
    
    initSlider(){
        
        this.venueSearchParams.capacity_to = 100000;
        this.venueSearchParams.price_to = 100000;
        let _the = this;

    
        var hu_3 = $(".current-slider-price-venue").ionRangeSlider({
            min: 1,
            max: 100000,
            from: 100000,
            step: 5,
            type: "single",
            hide_min_max: false,
            prefix: "$ ",
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

    GetVenueFromList(){
        this.venueShowsList = [];
        if(this.venuesList&&this.venuesList.length>0)
        for(let i of this.venuesList){
        this.main.accService.GetAccountById(i.venue_id)
            .subscribe((acc:AccountGetModel)=>{
            this.getMessages();
            acc.status_not_given = i.status;
            if(acc.image_id){
                this.main.imagesService.GetImageById(acc.image_id).
                subscribe((img)=>{
                    if(img.base64)
                        acc.image_base64_not_given = img.base64;
                    else
                        acc.image_base64_not_given = '../../../../assets/img/show.png';
                    this.venueShowsList.push(acc);
                })
            }
            else {
                acc.image_base64_not_given = '../../../../assets/img/show.png';
                this.venueShowsList.push(acc);
            }
            });
        for(let v =0; v<this.requestVenues.length;v++){
            if (this.requestVenues[v].id==i.venue_id){
                this.requestVenues.splice(v,1);
            }
        }
        }
    }

    getMessages(id?:number){
        let crId = id?id:this.Event.creator_id;
        this.messagesList = [];
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
                m.message_info.event_info.id == this.Event.id){
                   return m.message_info.price;
            }
        }
        return '-';
    }

    getIdAtMsg(sender:number){
        for(let m of this.messagesList){
            if( m.sender_id == sender && 
                m.receiver_id == this.Event.creator_id &&
                m.message_info.event_info.id == this.Event.id){
                   return m.id;
            }
        }
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

        console.log(`Params`,this.venueSearchParams);
        this.main.accService.AccountsSearch(this.venueSearchParams).
             subscribe((res)=>{
                console.log(this.venueSearchParams,`res`,res);
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
            this.main.imagesService.GetImageById(a.object.image_id)
              .subscribe((img)=>{
                  if(img.base64)
                        a.object.image_base64_not_given = img.base64;
                    else
                    a.object.image_base64_not_given = '../../../../assets/img/show.png';
              });
            }
          else a.object.image_base64_not_given = '../../../../assets/img/show.png';
        }
    }


    addVenueCheck(venue:CheckModel<AccountGetModel>){
        venue.checked = !venue.checked;
        if(!this.ifRequestVenue(venue.object.id)&&!this.ifListVenue(venue.object.id)){
          this.requestVenues.push(venue.object);
        }
    }

   ifRequestVenue(id){
        for(let v of this.requestVenues)
            if(v.id==id) {
                return true;
            }   
        return false;
    }

    ifListVenue(id){
        for(let v of this.venueShowsList)
            if(v.id==id) {
                return true;
            }   
        return false;
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
            
            this.main.eventService.AddVenue(this.addVenue).
                subscribe((res)=>{
                  //  console.log(`ok add`);
                    $('#modal-send-request-venue').modal('toggle');
                    this.main.eventService.VenueSendRequest(this.addVenue)
                     .subscribe((send)=>{
                      //  console.log(`ok send`);
                        this.onError.emit("Request was sent!");
                    this.updateEvent();
                }, (err)=>{
                  console.log(err);
                })
                    
                },(err)=>{
                   
                    this.main.eventService.VenueSendRequest(this.addVenue)
                        .subscribe((send)=>{
                            this.onError.emit("Request was sent!");
                        this.updateEvent();
                }, (err)=>{ this.onError.emit("Request wasn't sent!");});
            });
    
        }
        else {
            //console.log(`Invalid Request Form!`, this.aboutForm);
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

        console.log(`INFO ABOUT ACCEPTED`,this.ownerAcceptDecline);
        this.main.eventService.VenueAcceptOwner(this.ownerAcceptDecline).
            subscribe((res)=>{
                this.onError.emit("Venue accepted!");
                this.updateEvent();
            },(err)=>{
                this.onError.emit("Venue NOT accepted! "+this.getResponseErrorMessage(err));
                console.log(`err`,err);
            });
    }

    declineVenue(card:AccountGetModel){

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

    
        this.main.eventService.VenueDeclineOwner(this.ownerAcceptDecline).
            subscribe((res)=>{
                this.onError.emit("Venue declined!");
                this.updateEvent();
            },(err)=>{
                this.onError.emit("Venue NOT declined!");
            });
    }

    sendVenueRequestOpenModal(venue:AccountGetModel){
        $('#modal-send-request-venue').modal('show');
        this.eventForRequest = venue;
    }

    createPrivateRes(){
        console.log(`submitVenue`);
        this.onError.emit(BaseMessages.Success);
        this.updateEvent();
    }

    updateEvent(){
        console.log(`update Event`);
        this.main.eventService.GetEventById(this.Event.id).
        subscribe((res:EventGetModel)=>{

           this.venuesList = [];
           setTimeout(() => {
            this.Event = this.main.eventService.EventModelToCreateEventModel(res);
           
            this.venuesList = this.Event.venues;
            console.log(`get this Event`, this.Event);
            this.GetVenueFromList();
           }, 500); 
        })
    }


    submitVenue(){
        this.updateEvent();
        this.onSaveEvent.emit(this.Event);
    }

    venueOpenMapModal(){
        $('#modal-map-3').modal('show');
        this.agmMap.triggerResize();
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
        return g.replace('_',' ');
    }

    isEmptyDeclinedArtists(){

        for(let a of this.requestVenues)
            if(a.status_not_given=='owner_declined'||a.status_not_given=='declined')
                return false;

        for(let a of this.venueShowsList)
            if(a.status_not_given=='owner_declined'||a.status_not_given=='declined')
                return false;

        return true;
    }


}
