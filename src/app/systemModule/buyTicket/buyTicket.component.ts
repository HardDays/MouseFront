import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { BaseImages } from '../../core/base/base.enum';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { TicketModel } from '../../core/models/ticket.model';
import { BuyTicketModel } from '../../core/models/buyTicket.model';


@Component({
    selector: 'buy-ticket-selector',
    templateUrl: './buyTicket.component.html'
})
export class ByTicketComponent extends BaseComponent implements OnInit {
    @Input() Ticket: TicketModel;
    @Output() onAddTickets = new EventEmitter<BuyTicketModel>();
    Count:number = 0;
    IsPlusDisabled:boolean = false;
    IsMinusDisabled:boolean = false;

    ngOnInit(): void 
    {
    }

    AddTickets()
    {
        let object:BuyTicketModel = new BuyTicketModel();
        object.count = this.Count;
        object.ticket = this.Ticket;

        this.onAddTickets.emit(object);
        this.Ticket.count -= this.Count;
        this.Count = 0;
    }

    ChangeCount(int:number)
    {
        this.Count += (this.Count + int >= 0 ) && (this.Count + int <= this.Ticket.count)?int:0;
    }
}