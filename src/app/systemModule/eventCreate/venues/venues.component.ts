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
import { MapsAPILoader } from '@agm/core';
import { Http } from '@angular/http';
import { GetVenue, EventGetModel } from '../../../core/models/eventGet.model';
import { AccountSearchModel } from '../../../core/models/accountSearch.model';
import { CheckModel } from '../../../core/models/check.model';
import { SelectModel } from '../../../core/models/select.model';
import { FormGroup, FormControl } from '@angular/forms';
import { AccountAddToEventModel } from '../../../core/models/artistAddToEvent.model';
import { InboxMessageModel } from '../../../core/models/inboxMessage.model';
import { EventCreateModel } from '../../../core/models/eventCreate.model';

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
    
    @ViewChild('searchVenue') public searchElementVenue: ElementRef;

    venuesList: GetVenue[] = [];
    isAcceptedVenueShow:boolean = true;
    isPrivateVenue:boolean = false;
    Venues:AccountGetModel[] = [];
    venueList:CheckModel<AccountGetModel>[] = [];

    mapCoords =  {lat:55.755826, lng:37.6172999};
   
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
    }
    Init(event?:EventCreateModel)
    {
      this.venuesList = event.venues;
    //  console.log(this.venuesList);
      this.GetVenueFromList();
    }
    
    initSlider(){
        
        let _the = this;

    
        var hu_3 = $(".current-slider-price-venue").ionRangeSlider({
            min: 0,
            max: 100000,
            from: 20000,
            step: 5,
            type: "single",
            hide_min_max: false,
            prefix: "$ ",
            grid: false,
            prettify_enabled: true,
            prettify_separator: ',',
            grid_num: 5,
            onChange: function (data) {
                _the.VenuePriceChanged(data);
            }
        });
    
        var hu_4 = $(".current-slider-capacity-venue").ionRangeSlider({
            min: 0,
            max: 100000,
            from: 10000,
            step: 10,
            type: "single",
            hide_min_max: false,
    
            grid: false,
            prettify_enabled: true,
            prettify_separator: ',',
            grid_num: 5,
            onChange: function (data) {
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
                    acc.image_base64_not_given = img.base64;
                    this.venueShowsList.push(acc);
                })
            }
            else this.venueShowsList.push(acc);
            })
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
                    //console.log(`msg`,this.messagesList);
            }); 
        },
        (err)=>{//console.log(err)
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
        this.venueSearchParams.price_from  = data.from;
        this.venueSearch();

    }
    VenueCapacityChanged(data){
        this.venueSearchParams.capacity_from = data.from;
        this.venueSearch();
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
                            // this.mapCoords.venue.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                            // this.mapCoords.venue.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                        }
                    });
                });
            }
        );
    }
    venueSearch($event?:string){
        this.venueList = [];
      
        this.venueSearchParams.type = 'venue';
        if($event) this.venueSearchParams.text = $event;
        this.venueSearchParams.types_of_space = [];
        
        for(let space of this.typesSpace)
            if(space.checked) this.venueSearchParams.types_of_space.push(space.object.value)

        //  this.accService.AccountsSearch( this.venueSearchParams).
        //      subscribe((res)=>{
        //          if(res.length>0){
        //              this.venueList = this.deleteDuplicateAccounts(res);
        //              this.getListImages(this.venueList);
        //          }
        //  });

         this.main.accService.AccountsSearch(this.venueSearchParams).
             subscribe((res)=>{
                //  if(res.length>0){
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
                    this.venueList = temp;
                 //   console.log(this.venueList);
                  
                //  }
         });
    }


    addVenueCheck(venue:CheckModel<AccountGetModel>){
        venue.checked = !venue.checked;

        if(!this.ifRequestVenue(venue.object.id)&&!this.ifListVenue(venue.object.id)){
          this.requestVenues.push(venue.object);
        }
        // console.log(this.requestVenues);
       
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

//    ifCheckedVenue(id){
//     if(this.checkVenue.indexOf(id)<0) return this.ifRequestVenue(id);
//         else return true;
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


getRequestVenue(){
    // this.requestVenues = [];
    // for(let venue of this.Event.venues){
    //     this.accService.GetAccountById(venue.venue_id).
    //         subscribe((res:AccountGetModel)=>{
    //             if(this.isNewAccById(this.requestVenues,res)){
    //                     this.requestVenues.push(res);
    //                     let index = 0;
    //                     for(let sh of this.venueShowsList){
    //                         if(sh.id==res.id) this.venueShowsList.splice(index,1);
    //                         index = index + 1;
    //                     }
    //                     if(this.ifShowsVenue(res.id)){
    //                         console.log(`ifShowsVenue`);
    //                         this.addVenueCheck(res);
    //                     }
    //                     if(res.image_id){
    //                         this.imgService.GetImageById(res.image_id)
    //                             .subscribe((img:Base64ImageModel)=>{
    //                                 res.image_base64_not_given = img.base64;
    //                             },
    //                             (err)=>{
    //                                 //console.log(`err img`,err);
    //                             });
    //                     }
    //              }
    //     });
    // }
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
            //console.log(`add venue`,this.addVenue);
            
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
                  //  console.log(err);
                })
                    
                },(err)=>{
                    this.onError.emit("Request wasn't sent!");
                    this.main.eventService.VenueSendRequest(this.addVenue)
                        .subscribe((send)=>{
                          //  console.log(`ok send error`);
                        this.updateEvent();
                });
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
    //console.log(idV);

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

       // console.log(this.ownerAcceptDecline);
        this.main.eventService.VenueAcceptOwner(this.ownerAcceptDecline).
            subscribe((res)=>{
                this.onError.emit("Venue accepted!");
                //console.log(`ok accept artist`,res);
                this.updateEvent();
            },(err)=>{
                this.onError.emit("Venue NOT accepted!");
            });

        // //console.log(this.ownerAcceptDecline);   
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

    //console.log(this.ownerAcceptDecline);
    
        this.main.eventService.VenueDeclineOwner(this.ownerAcceptDecline).
            subscribe((res)=>{
                //console.log(`ok accept artist`,res);
                this.onError.emit("Venue declined!");
                this.updateEvent();
            },(err)=>{
                this.onError.emit("Venue NOT declined!");
            });

        //console.log(this.ownerAcceptDecline); 
}

    sendVenueRequestOpenModal(venue:AccountGetModel){
        $('#modal-send-request-venue').modal('show');
        this.eventForRequest = venue;
    }

    updateEvent(){
        console.log(`UPDATE EVENT`);
        this.main.eventService.GetEventById(this.Event.id).
        subscribe((res:EventGetModel)=>{
           // console.log(`updateEventThis`);
            this.Event = this.main.eventService.EventModelToCreateEventModel(res);
            this.venuesList = [];
            this.venuesList = this.Event.venues;
            console.log(`---`,this.Event,this.venueShowsList);
            this.GetVenueFromList();
          
})
    }

    submitVenue(){
        this.onSaveEvent.emit(this.Event);
    }

    venueOpenMapModal(){
        $('#modal-map-3').modal('show');
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














}
