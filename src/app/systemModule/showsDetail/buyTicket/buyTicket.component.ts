import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { TicketModel } from '../../../core/models/ticket.model';
import { BuyTicketModel } from '../../../core/models/buyTicket.model';
import { Currency, CurrencyIcons } from '../../../core/models/preferences.model';


@Component({
    selector: 'buy-ticket-selector',
    templateUrl: './buyTicket.component.html',
    styleUrls: ['./../showsDetail.component.css']
})
export class ByTicketComponent extends BaseComponent implements OnInit {
    @Input() Ticket: TicketModel;
    @Output() onAddTickets = new EventEmitter<BuyTicketModel>();
    @Output() OnCountTicketChanges = new EventEmitter<BuyTicketModel>();
    Count:number = 0;
    IsPlusDisabled:boolean = false;
    IsMinusDisabled:boolean = false;
    Currency:string = CurrencyIcons[Currency.USD];
    OriginalCurrency:string = CurrencyIcons[Currency.USD];
    TotalCount = 0;

    ngOnInit(): void 
    {
        this.Currency = CurrencyIcons[this.main.settings.GetCurrency()];
        this.OriginalCurrency = CurrencyIcons[this.Ticket.currency];
        this.TotalCount = this.Ticket.count;
        this.Count = 0;
        // this.Count = 100;
        // this.Ticket.count = -100;
    }

    AddTickets()
    {
        let object:BuyTicketModel = new BuyTicketModel();
        object.count = this.Count;
        object.ticket = this.Ticket;

        this.onAddTickets.emit(object);
        this.Ticket.count -= this.Count;
        //this.Count = 0;
    }

    ChangeCount(int:number)
    {
        this.Count += (this.Count + int >= 0 ) && (this.Count + int <= this.Ticket.count)?int:0;
        this.TotalCount = this.Ticket.count - this.Count;
        this.OnCountTicketChanges.emit(new BuyTicketModel(this.Count, this.Ticket));
    }
}