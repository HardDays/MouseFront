import { Component, OnInit, NgZone, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AuthMainService } from '../../../core/services/auth.service';
import { AccountService } from '../../../core/services/account.service';
import { ImagesService } from '../../../core/services/images.service';
import { TypeService } from '../../../core/services/type.service';
import { GenresService } from '../../../core/services/genres.service';
import { EventService } from '../../../core/services/event.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'angular2-social-login';
import { MapsAPILoader } from '@agm/core';
import { Http } from '@angular/http';
import { TicketModel } from '../../../core/models/ticket.model';
import { TicketGetParamsModel } from '../../../core/models/ticketGetParams.model';
import { EventGetModel } from '../../../core/models/eventGet.model';
import { EventCreateModel } from '../../../core/models/eventCreate.model';

@Component({
  selector: 'app-add-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})

export class AddTicketsComponent extends BaseComponent implements OnInit {

    @Input() Event:EventCreateModel;
    @Output() onSaveEvent:EventEmitter<EventCreateModel> = new EventEmitter<EventCreateModel>();
  
  tickets:TicketModel[] = [];
  ticketsNew:TicketModel[] = [];
  currentTicket:TicketModel = new TicketModel();
  isCurTicketNew:boolean = false;
  
  
  ngOnInit() {
    // this.CreateAutocompleteArtist();
    
  }
  Init(event:EventCreateModel){
    this.Event = event;
    this.getTickets();
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



  getTickets(){
    console.log(`getTickets`);
    this.tickets = [];
    let params:TicketGetParamsModel = new TicketGetParamsModel();
    params.account_id = this.CurrentAccount.id;
    params.event_id = this.Event.id;
  
    if(this.Event&&this.Event.tickets)
    for(let t of this.Event.tickets){
        params.id = t.id;
        this.main.eventService.GetTickets(params).
            subscribe((res:TicketModel)=>{
                this.tickets.push(res);
                this.currentTicket = this.tickets[0];
            }); 
    }
    
}

addTicket(){
    let newTicket:TicketModel = new TicketModel();
    newTicket.id = this.getNewId();
    newTicket.event_id = this.Event.id;
    newTicket.account_id = this.CurrentAccount.id;
    newTicket.name = 'New Name';
    newTicket.type = 'vr';
    newTicket.is_promotional = false;
    newTicket.is_for_personal_use = false;
    this.ticketsNew.push(newTicket);
    this.currentTicket = this.ticketsNew[this.ticketsNew.length-1];
    this.isCurTicketNew = true;
}
getNewId(){
    let id = 1;
    for(let t of this.ticketsNew)
        id+=t.id;
    return id;
}

updateTicket(){
    if(this.isCurTicketNew) {

        let index:number = -1;
        for(let i in this.ticketsNew)
            if(this.ticketsNew[i].id == this.currentTicket.id) 
                index = +i;
        //console.log(`index`,index);

        this.currentTicket.id = null;
        //console.log(`new create`,this.currentTicket);
        this.main.eventService.AddTicket(this.currentTicket)
            .subscribe((res)=>{
                //console.log(`create`,res);
                this.isCurTicketNew = false;

                this.ticketsNew.splice(index,1);

                this.updateEventTickets();
            });

    }
    else {
        this.currentTicket.account_id = this.CurrentAccount.id;
        //console.log(`update old`,this.currentTicket);
        this.main.eventService.UpdateTicket(this.currentTicket)
            .subscribe((res)=>{
                //console.log(`update`,res);
                this.updateEventTickets();
            });
    }
}

updateEventTickets(){ 
    this.main.eventService.GetEventById(this.Event.id).
    subscribe((res:EventGetModel)=>{
        console.log(`updateEventThis`);
        this.Event = this.main.eventService.EventModelToCreateEventModel(res);
        this.getTickets();
    })  
}
updateEvent(){
    this.onSaveEvent.emit(this.Event);
}

  
}
