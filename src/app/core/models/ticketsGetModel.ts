import { AccountGetModel } from "./accountGet.model";


export class TicketsGetModel{
    constructor(
        public id?: number,
        public name?: string,
        public tagline?: string,
        public description?: string,
        public funding_from?: any,
        public funding_to?: any,
        public funding_goal?: number,
        public creator_id?: number,
        public created_at?: string,
        public updated_at?: string,
        public is_active?: boolean,
        public views?: number,
        public clicks?: number,
        public has_vr?: boolean,
        public has_in_person?: boolean,
        public updates_available?: boolean,
        public comments_available?: boolean,
        public date_from?: any,
        public date_to?: any,
        public event_season?: string,
        public event_year?: number,
        public event_length?: number,
        public event_time?: string,
        public is_crowdfunding_event?: boolean,
        public city_lat?: number,
        public city_lng?: number,
        public artists_number?: number,
        public address?: string,
        public image_id?: number,
        public video_link?: string,
        public in_person_tickets?: boolean,
        public vr_tickets?: boolean,
        public tickets_count?:number,
        public currency?:string,
        public city?:string,
        public state?:string,
        public venue?: AccountGetModel,
        public country?: string
        
    )
    {}

    public static GetTicketLocation(ticket: TicketsGetModel)
    {
        if(!ticket.venue)
            return ticket.address;
        
        let arr = [];

        if(ticket.venue.city)
            arr.push(ticket.venue.city);

        if(ticket.venue.state)
            arr.push(ticket.venue.state);

        if(ticket.venue.country)
            arr.push(ticket.venue.country);

        if(arr.length > 0)
            return arr.join(', ');

        if(ticket.city)
            arr.push(ticket.city);

        if(ticket.state)
            arr.push(ticket.state);
        
        if(ticket.country)
            arr.push(ticket.country);

        return arr.length > 0 ? arr.join(', ') : '';
    }
}

/*export class GetArtists{
    constructor(
        public artist_id?: number,
        public reason?: string,
        public status?: string,
        public image_base64_not_given?: string,
        public user_name_not_given?: string,
        public agreement?:{
             id?:number,
             price?:number,
             datetime_from?:string,
             datetime_to?:string,
             venue_event_id?:number,
             artist_event_id?:number,
             created_at?:string,
             updated_at?:string,
        }
    )
    {}
}
export class GetVenue{
    constructor(
        public venue_id?: number,
        public reason?: string,
        public status?: string,
        public image_base64_not_given?: string,
        public user_name_not_given?: string,
        public agreement?:{
            id?:number,
            price?:number,
            datetime_from?:string,
            datetime_to?:string,
            venue_event_id?:number,
            artist_event_id?:number,
            created_at?:string,
            updated_at?:string,
       }
    )
    {}
}*/