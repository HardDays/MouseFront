import { TicketModel } from './ticket.model';
export class BuyTicketModel
{
    constructor(
        public count?:number,
        public ticket?:TicketModel
    ){}
}