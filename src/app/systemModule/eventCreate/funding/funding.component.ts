import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, SimpleChange } from '@angular/core';
import { CheckModel } from '../../../core/models/check.model';
import { GetVenue } from '../../../core/models/eventPatch.model';
import { GetArtists, EventGetModel } from '../../../core/models/eventGet.model';
import { BaseComponent } from '../../../core/base/base.component';
import { Base64ImageModel } from '../../../core/models/base64image.model';
import { EventCreateModel } from '../../../core/models/eventCreate.model';
import { BaseImages, RequestFields, AccountStatus, InviteStatus } from '../../../core/base/base.enum';
import { InboxMessageModel } from '../../../core/models/inboxMessage.model';

@Component({
  selector: 'app-funding',
  templateUrl: './funding.component.html',
  styleUrls: ['./funding.component.css']
})
export class FundingComponent extends BaseComponent implements OnInit {

    activeArtist:CheckModel<GetArtists> [] = [];
    activeVenue:CheckModel<GetVenue>[] = [];
    
    artistSum:number = 0;
    venueSum:number = 0;
    additionalCosts:number = 0;
    familyAndFriendAmount:string = '0%';

    isLoadingArtist = true;
    isLoadingVenue = true;

    messagesList:InboxMessageModel[] = [];

    @Input() Event:EventCreateModel;
    @Input() isHasVenue:boolean;
    @Output() onSaveEvent:EventEmitter<EventCreateModel> = new EventEmitter<EventCreateModel>();
    @Output() onSave:EventEmitter<EventCreateModel> = new EventEmitter<EventCreateModel>();
    @Output() onError:EventEmitter<string> = new EventEmitter<string>();

    ngOnInit() {

        this.isLoadingArtist = true;
        this.isLoadingVenue = true;
        this.activeArtist = [];
        this.activeVenue = [];

       
        this.main.eventService.GetEventById(this.Event.id).
            subscribe(
                (res:EventGetModel)=>{
                    this.Event = this.main.eventService.EventModelToCreateEventModel(res); 
                    this.getMessages();
                }
            )
    }

    getMessages(){
        this.messagesList = [];

        this.main.accService.GetInboxMessages(this.Event.creator_id).
        subscribe((res)=>{
            for(let m of res)
                this.main.accService.GetInboxMessageById(this.Event.creator_id, m.id).
                    subscribe((msg)=>{
                        this.messagesList.push(msg);
                        if(this.messagesList.length===res.length)
                            this.getActiveArtVen();
                });
            
        },
        (err)=>{
        });
    }



    getFamilyAndFriendAmount(){
        let sum =  this.Event.family_and_friends_amount/100;
        return sum*(0.1*(this.artistSum+this.venueSum+this.Event.additional_cost)+(this.artistSum+this.venueSum+this.Event.additional_cost));
    }


    setActiveArtist(index:number){
        if(!this.activeArtist[index].checked){
            
            
            this.main.eventService.ArtistSetActive({
                id:this.activeArtist[index].object.artist_id,
                event_id:this.Event.id,
                account_id:this.Event.creator_id
            }).
                subscribe((res)=>{
                    //console.log(`active set ok`,res);
                    this.updateEvent();
                    this.activeArtist[index].checked = true;
                    this.artistSum += this.activeArtist[index].object.artist.price;

                });
        }
        else {
            
            this.main.eventService.ArtistRemoveActive({
                id:this.activeArtist[index].object.artist_id,
                event_id:this.Event.id,
                account_id:this.Event.creator_id
            }).
                subscribe((res)=>{
                    //console.log(`active remove ok`,res);
                    this.updateEvent();
                    this.activeArtist[index].checked = false;
                    this.artistSum -= this.activeArtist[index].object.artist.price;
                });
        }

    }

    setActiveVenue(index:number){
        if(!this.activeVenue[index].checked){
            
            this.main.eventService.VenueSetActive({
                id:this.activeVenue[index].object.venue_id,
                event_id:this.Event.id,
                account_id:this.Event.creator_id
            }).
                subscribe((res)=>{
                    //console.log(`active set ok`,res);
                    this.updateEvent();
                    this.activeVenue[index].checked = true;
                    this.venueSum += this.activeVenue[index].object.venue.price;
                });
        }
        else {
            
            this.main.eventService.VenueRemoveActive({
                id:this.activeVenue[index].object.venue_id,
                event_id:this.Event.id,
                account_id:this.Event.creator_id
            }).
                subscribe((res)=>{
                    //console.log(`active remove ok`,res);
                    this.updateEvent();
                    this.activeVenue[index].checked = false;
                    this.venueSum -= this.activeVenue[index].object.venue.price;
                });
        }


    }

    getNumInArtistOrVenueById(id:number,list:any[]){
        if(id){
            for(let i=0; i<list.length; i++){
                if(list[i].id==id)
                    return i;
            }
        }   
    }


    getActiveArtVen(){

        this.artistSum = 0;
        this.venueSum = 0;

        

        this.activeArtist = this.convertArrToCheckModel<GetArtists>(this.Event.artist);
        this.activeVenue = this.convertArrToCheckModel<GetVenue>(this.Event.venues);

        let i = 0;
        for(let item of this.activeArtist){
            if(item.object.status===InviteStatus.RequestSend || 
                item.object.status===InviteStatus.Accepted ||
                item.object.status===InviteStatus.OwnerAccepted ||
                item.object.status===InviteStatus.Active)
            {    
                let price = this.getPriceAtMsg(item.object.artist_id);
                if(price){
                    this.activeArtist[i].object.artist.price = price;
                }
            }
            if(item.object.is_active){
                item.checked = true;
                this.artistSum += this.activeArtist[i].object.artist.price;
            }
            i = i + 1;
        }

        i = 0;
        for(let item of this.activeVenue){
            if(item.object.status===InviteStatus.RequestSend || 
                item.object.status===InviteStatus.Accepted ||
                item.object.status===InviteStatus.OwnerAccepted ||
                item.object.status===InviteStatus.Active)
            {    
                let price = this.getPriceAtMsg(item.object.venue_id);
                //console.log(price);
                if(price){
                    this.activeVenue[i].object.venue.price = price;
                }
            }
            if(item.object.is_active){
                item.checked = true;
                this.venueSum += this.activeVenue[i].object.venue.price;
            }
            i = i + 1;
        }

        this.getImagesArtist(this.activeArtist);
        this.getImagesVenue(this.activeVenue);

    }

    getImagesArtist(list:CheckModel<GetArtists>[]){
        for(let item of list){
            if(item.object.artist.image_id){
                item.object.artist.image_base64 = this.main.imagesService.GetImagePreview(item.object.artist.image_id,{width:140,height:140});
            }
            else{
                item.object.artist.image_base64 = BaseImages.NoneFolowerImage;
            }
        }
        setTimeout(() => {
            this.isLoadingArtist = false;
        }, 500);
        
    }

    getImagesVenue(list:CheckModel<GetVenue>[]){
        for(let item of list){
            if(item.object.venue.image_id){
                item.object.venue.image_base64 = this.main.imagesService.GetImagePreview(item.object.venue.image_id,{width:140,height:140});
            }
            else{
                item.object.venue.image_base64 = BaseImages.NoneFolowerImage;
            }
        }
        setTimeout(() => {
            this.isLoadingVenue = false;
        }, 500);
    }





    updateEvent(){
        this.main.eventService.GetEventById(this.Event.id).
        subscribe((res:EventGetModel)=>{         
            this.Event = this.main.eventService.EventModelToCreateEventModel(res);
            this.onSave.emit(this.Event);     
        })  
    }

    comleteFunding(){
        this.onSaveEvent.emit(this.Event);
    }


    getPriceAtMsg(senderId:number){
        if(this.messagesList){
            for(let m of this.messagesList){
                if( m.sender_id === senderId && 
                    m.receiver_id === this.Event.creator_id &&
                    m.message_info&&m.message_info.event_info&&
                    m.message_info.event_info.id === this.Event.id){
                        return m.message_info.price;
                }
                
            }
            return null;
        }
    }


}
