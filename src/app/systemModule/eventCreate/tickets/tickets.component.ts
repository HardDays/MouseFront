import { Component, OnInit, NgZone, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AuthMainService } from '../../../core/services/auth.service';
import { AccountService } from '../../../core/services/account.service';
import { ImagesService } from '../../../core/services/images.service';
import { TypeService } from '../../../core/services/type.service';
import { GenresService } from '../../../core/services/genres.service';
import { EventService } from '../../../core/services/event.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute, Event } from '@angular/router';
import { AuthService } from 'angular2-social-login';
import { MapsAPILoader } from '@agm/core';
import { Http } from '@angular/http';
import { TicketModel } from '../../../core/models/ticket.model';
import { TicketGetParamsModel } from '../../../core/models/ticketGetParams.model';
import { EventGetModel } from '../../../core/models/eventGet.model';
import { EventCreateModel } from '../../../core/models/eventCreate.model';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap';
import { CurrencyIcons } from '../../../core/models/preferences.model';

@Component({
  selector: 'app-add-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})

export class AddTicketsComponent extends BaseComponent implements OnInit {

    @Input() Event:EventCreateModel;
    @Output() onSaveEvent:EventEmitter<EventCreateModel> = new EventEmitter<EventCreateModel>();
    @Output() onSave:EventEmitter<EventCreateModel> = new EventEmitter<EventCreateModel>();
    @Output() onError:EventEmitter<string> = new EventEmitter<string>();
    private _picker: BsDatepickerDirective;
    tickets:TicketModel[] = [];
    ticketsNew:TicketModel[] = [];
    currentTicket:TicketModel = new TicketModel();
    isCurTicketNew:boolean = false;
    isEng: boolean;

    analitics:any;

    maxCountInPerson = 0;
    maxCountVr = 0;


    CurrencySymbol = '$';

    bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, { containerClass: 'theme-default', showWeekNumbers:false });

     datepickerFromModel:Date;
     datepickerToModel:Date;

  ngOnInit() {
    // this.CreateAutocompleteArtist();
    this.CurrencySymbol = CurrencyIcons[this.Event.currency];
    this.isEng = this.isEnglish();

    this.getTickets();

    // console.log(`INIT`);



  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if(changes.Event){
  //     this.Event = changes.Event.currentValue;
  //     this.getTickets();
  //   }
  // }

  Init(event:EventCreateModel){

  }

  deleteDuplicateTickets(t:TicketModel[]){
    for (var q=1, i=1; q<t.length; ++q) {
        if (t[q].id !== t[q-1].id) {
          t[i++] = t[q];
        }
      }
      t.length = i;
      return t;
}

onShowPicker(event) {
    const dayHoverHandler = event.dayHoverHandler;
    const hoverWrapper = (hoverEvent) => {
        const { cell, isHovered } = hoverEvent;

        if ((isHovered &&
          !!navigator.platform &&
          /iPad|iPhone|iPod/.test(navigator.platform)) &&
          'ontouchstart' in window
        ) {
            (this._picker as any)._datepickerRef.instance.daySelectHandler(cell);
        }

        return dayHoverHandler(hoverEvent);
    };
    event.dayHoverHandler = hoverWrapper;
}

  getTickets(){
    //console.log(`getTickets`);
    this.tickets = [];
    let params:TicketGetParamsModel = new TicketGetParamsModel();
    params.account_id = this.CurrentAccount.id;
    params.event_id = this.Event.id;

    if(this.Event&&this.Event.tickets){

        // this.main.eventService.GetAnalytics(this.Event.id)
        //     .subscribe((res)=>{
        //         this.analitics = res;
        //     },
        //     (err)=>{
        //         // console.log(`err`,err);
        //     }
        // )

        for(let t of this.Event.tickets){
            params.id = t.id;
            this.main.eventService.GetTickets(params).
                subscribe((res:TicketModel)=>{
                    this.tickets.push(res);
                    this.currentTicket = this.tickets[0];
                    this.setDate();
                });
        }
        this.maxCountInPerson = this.Event.venue.capacity - this.Event.in_person_tickets;
        this.maxCountVr = this.Event.venue.vr_capacity - this.Event.vr_tickets;
    }

}

addTicket(){
    let newTicket:TicketModel = new TicketModel();
    newTicket.id = this.getNewId();
    newTicket.currency = this.Event.currency;
    newTicket.event_id = this.Event.id;
    newTicket.account_id = this.CurrentAccount.id;
    if (this.isEng)
        newTicket.name = 'New Name';
    else
        newTicket.name = 'Новое Название';
    newTicket.type = 'vr';
    newTicket.is_promotional = false;
    newTicket.is_for_personal_use = false;
    this.ticketsNew.push(newTicket);
    this.currentTicket = this.ticketsNew[this.ticketsNew.length-1];
    this.isCurTicketNew = true;
    this.datepickerToModel = new Date();
    this.datepickerFromModel = new Date();
}

getNewId(){
    let id = 1;
    for(let t of this.ticketsNew)
        id+=t.id;
    return id;
}

getCurrencyPrice(currency:string){
  return  CurrencyIcons[currency];
}

updateTicket(){

    this.currentTicket.promotional_date_from = this.datepickerFromModel.toString();
    this.currentTicket.promotional_date_to = this.datepickerToModel.toString();
    this.currentTicket.currency = this.Event.currency;

    if(this.isCurTicketNew) {
        if(this.currentTicket.type==='vr'){
            if(this.currentTicket.count>this.maxCountVr){
                this.onError.emit('<b>Failed!</b> VR Tickets limit expired');
                // console.log(`front error`);
                return;
            }
        }
        else{
            if(this.currentTicket.count>this.maxCountInPerson){
                this.onError.emit('<b>Failed!</b> Tickets limit expired');
                // console.log(`front error`);
                return;
            }
        }

        let index:number = -1;
        for(let i in this.ticketsNew)
            if(this.ticketsNew[i].id == this.currentTicket.id)
                index = +i;
        //console.log(`index`,index);

        this.currentTicket.id = null;
        // console.log(`new create`,this.currentTicket);
        this.main.eventService.AddTicket(this.currentTicket)
            .subscribe((res)=>{
                //console.log(`create`,res);
                this.isCurTicketNew = false;

                this.ticketsNew.splice(index,1);

                this.updateEventTickets();
            },(err)=>{
                // console.log(`back error`);
                this.onError.emit(this.getResponseErrorMessage(err));
            });
    }
    else {
        this.currentTicket.account_id = this.CurrentAccount.id;
        //console.log(`update old`,this.currentTicket);
        this.main.eventService.UpdateTicket(this.currentTicket)
            .subscribe((res)=>{
                //console.log(`update`,res);
                this.updateEventTickets();
            },(err)=>{
            //   console.log(err);

                if(err.json()['tickets']==='ALREADY_BOUGHT'){
                  this.onError.emit('<b>Failed!</b> Tickets already bought!');
                }
                else
                  this.onError.emit('<b>Failed!</b> Tickets limit expired');
            });
    }
}

updateEventTickets(){
    this.main.eventService.GetEventById(this.Event.id).
    subscribe((res:EventGetModel)=>{
        //console.log(`updateEventThis`);
        this.Event = this.main.eventService.EventModelToCreateEventModel(res);
        this.onSave.emit(this.Event);
        this.getTickets();
    })
}
updateEvent(){
    this.onSaveEvent.emit(this.Event);
}

setDate(){
    this.datepickerToModel = new Date(this.currentTicket.promotional_date_to);
    this.datepickerFromModel = new Date(this.currentTicket.promotional_date_from);
}


}
