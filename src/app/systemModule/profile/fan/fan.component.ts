import { Component, OnInit, OnChanges, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { BaseComponent } from "../../../core/base/base.component";
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { TicketsGetModel } from "../../../core/models/ticketsGetModel";
import { EventGetModel } from "../../../core/models/eventGet.model";

@Component({
    selector: 'fan-profile-selector',
    templateUrl: './fan.component.html',
    styleUrls: [
        './../profile.component.css'
    ]
})
export class FanProfileComponent extends BaseComponent implements OnInit,OnChanges {
    
    @Input() Account: AccountGetModel;
    @Input() Image:string;
    @Input() Fans:AccountGetModel[];
    @Input() IsMyAccount:boolean;
    @Input() isFolowedAcc:boolean;
    @Output() onFollow:EventEmitter<boolean> = new EventEmitter<boolean>();

    TotalTicket:number = 0;
    TicketMass:TicketsGetModel[] = [];
    ticketsMassChecked:TicketsGetModel[] = [];

    EventsMass:EventGetModel[] = [];
    EventsMassChecked:EventGetModel[] = [];

    FansChecked:AccountGetModel[] = [];
    

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.Account)
        {
            this.Account = changes.Account.currentValue;
            
        }
        
        if(changes.Fans)
            this.FansChecked = this.Fans = changes.Fans.currentValue;

        this.InitByUser();
    }

    ngOnInit(): void {
        this.InitByUser();
    }

    InitByUser()
    {
        this.GetTickets();
        this.GetEvents();
    }

    CountTickets()
    {
        this.TotalTicket = 0;
        for(let item of this.TicketMass)
        {
            this.TotalTicket += item.tickets_count;
        }
    }
    GetTickets()
    {
        this.ticketsMassChecked = this.TicketMass = [];
        if(this.Account.id)
        {
            this.WaitBeforeLoading(
                () => this.main.eventService.GetAllTicketswithoutCurrent(this.Account.id),
                (res:TicketsGetModel[]) =>
                {
                    this.ticketsMassChecked = this.TicketMass = res;
                    this.CountTickets();
                },
                (err) => {
                //   console.log(err);
                }
            );
        }
        else 
            this.CountTickets();
    }

    searchTickets(event)
    {
        let searchParam = event.target.value;
        console.log(this.ticketsMassChecked);
        if(searchParam)
            this.ticketsMassChecked = this.TicketMass.filter(obj => obj.name && obj.name.indexOf(searchParam)>=0);
        else this.ticketsMassChecked = this.TicketMass;
    }

    GetEvents()
    {
        this.EventsMassChecked = this.EventsMass = [];
        if(this.Account.id)
        {
            this.WaitBeforeLoading(
                () => this.main.eventService.GetEvents(this.Account.id),
                (res:EventGetModel[]) => {
                    this.EventsMassChecked = this.EventsMass = res;
                },
                (err) => {
                //  console.log(err);
                }
            );
        }
    }

    searchEvents(event)
    {
        let searchParam = event.target.value;
        if(searchParam)
            this.EventsMassChecked = this.EventsMass.filter(obj => obj.name.indexOf(searchParam)>=0);
        else this.EventsMassChecked = this.EventsMass;
    }

    searchFans(event)
    {
        let searchParam = event.target.value;
        if(searchParam)
            this.FansChecked = this.Fans.filter(obj => obj.user_name.indexOf(searchParam)>=0);
        else this.FansChecked = this.Fans;
    }

    FollowProfile(event:boolean)
    {
        this.onFollow.emit(event);
    }
}