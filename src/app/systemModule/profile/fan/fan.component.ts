import { Component, OnInit, OnChanges, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { BaseComponent } from "../../../core/base/base.component";
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { TicketsGetModel } from "../../../core/models/ticketsGetModel";
import { EventGetModel } from "../../../core/models/eventGet.model";
import { GenreModel } from "../../../core/models/genres.model";
import { AccountStatus } from "../../../core/base/base.enum";

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
    @Input() MyProfileId: number;
    @Input() AccStatus: string;
    @Output() onFollow:EventEmitter<boolean> = new EventEmitter<boolean>();

    isPreloadTickets:boolean = true;
    isPreloadEvents:boolean = true;
    isPreloadFans:boolean = true;

    TotalTicket:number = 0;
    TicketMass:TicketsGetModel[] = [];
    ticketsMassChecked:TicketsGetModel[] = [];
    genres:GenreModel[] = [];
    EventsMass:EventGetModel[] = [];
    EventsMassChecked:EventGetModel[] = [];

    FansChecked:AccountGetModel[] = [];

    Status = AccountStatus;

    ngOnChanges(changes: SimpleChanges): void {
        
        // if(changes.Account)
        // {
        //     this.Account = changes.Account.currentValue;
        // }
        // if(changes.MyProfileId){
        //     this.MyProfileId = changes.MyProfileId.currentValue;
        // }
        if(changes.Fans){
            this.isPreloadFans = true;
            this.FansChecked = this.Fans = changes.Fans.currentValue;
            this.isPreloadFans = false;
            // console.log('ok');
        }    
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
        for(let item of this.ticketsMassChecked)
        {
            this.TotalTicket += item.tickets_count;
        }
    }
    GetTickets()
    {
        this.ticketsMassChecked = this.TicketMass = [];
        if(this.Account.id)
        {
            this.isPreloadTickets = true;
                this.main.eventService.GetAllTicketswithoutCurrent(this.Account.id)
                .subscribe(
                (res:TicketsGetModel[]) =>
                {
                    //console.log(res);
                    this.ticketsMassChecked = this.TicketMass = res;
                    
                    this.CountTickets();
                    this.isPreloadTickets = false;
                },
                (err) => {
                }
            );
        }
        else 
            this.CountTickets();
    }

    searchTickets(event)
    {
        let searchParam = event.target.value;
        if(searchParam){
            this.ticketsMassChecked = this.TicketMass.filter(obj => obj.name && obj.name.toLowerCase().indexOf(searchParam.toLowerCase())>=0);
        }
        else{ 
            this.ticketsMassChecked = this.TicketMass;
        }

        this.CountTickets()
    }

    GetEvents()
    {
        this.EventsMassChecked = this.EventsMass = [];
        this.isPreloadEvents = true;
        if(this.Account.id)
        {
            
                this.main.eventService.GetEvents(this.Account.id).subscribe(
                (res:EventGetModel[]) => {
                    // console.log(res);
                    this.EventsMassChecked = this.EventsMass = res;
                    this.isPreloadEvents = false;
                },
                (err) => {
                }
            );
        }
    }

    searchEvents(event)
    {
        let searchParam = event.target.value;
        if(searchParam)
            this.EventsMassChecked = this.EventsMass.filter(obj => obj.name.toLowerCase().indexOf(searchParam.toLowerCase())>=0);
        else this.EventsMassChecked = this.EventsMass;
    }

    searchFans(event)
    {
        let searchParam = event.target.value;
        if(searchParam)
            this.FansChecked = this.Fans.filter(obj => obj.user_name.toLowerCase().indexOf(searchParam.toLowerCase())>=0);
        else this.FansChecked = this.Fans;
    }

    FollowProfile(event:boolean)
    {
        this.onFollow.emit(event);
    }
}