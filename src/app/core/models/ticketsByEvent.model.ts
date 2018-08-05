import { TicketsGetModel } from "./ticketsGetModel";
import { Currency } from "./preferences.model";


export class TicketsByEventModel{
    constructor(
        public event?:TicketsGetModel,
        public tickets?: ticketsMass[]
    )
    {
        if(!event){
            this.event = new TicketsGetModel();
        }
        if(!tickets){
            this.tickets = [];
        }
    }
}

export class ticketsMass{
    constructor(
        public id?: number,
        public account_id?: number,
        public code?: any,
        public price?: number,
        public created_at?: string,
        public updated_at?: string,
        public ticket?: ticketsInfo,
        public tickets_left?:number,
        public currency?: string
)
{
    if(!ticket){
        this.ticket = new ticketsInfo();
    }
    if(!currency)
        this.currency = Currency.USD;
}
}


export class ticketsInfo{
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public price?: number,
        public count?: number,
        public is_for_personal_use?: boolean,
        public event_id?: number,
        public created_at?: string,
        public updated_at?: string,
        public video?: any,
        public is_promotional?: boolean,
        public type?: any          
     ){}
}