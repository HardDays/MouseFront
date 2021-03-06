import { TicketModel } from "./ticket.model";
import { AccountGetModel } from "./accountGet.model";

export class EventGetModel{
    constructor(
        public id?: number,
        public name?: string,
        public tagline?: string,
        public hashtag?: string,
        public description?: string,
        public funding_from?: string,
        public funding_to?: string,
        public funding_goal?: number,
        public creator_id?: number,
        public created_at?: string,
        public updated_at?: string,
        public is_active?: boolean,
        public views?: number,
        public artists?: any[],
        public clicks?: number,
        public has_vr?: boolean,
        public has_in_person?: boolean,
        public updates_available?: boolean,
        public comments_available?: boolean,
        public date_from?: string,
        public date_to?: string,
        public exact_date_from?: string,
        public exact_date_to?: string,
        public event_month?: string,
        public event_year?: string,
        public event_length?: string,
        public event_time?: string,
        public is_crowdfunding_event?: boolean,
        public city_lat?: string,
        public city_lng?: string,
        public city?:string,
        public state?:string,
        public artists_number?: number,
        public address?: string,
        public image_id?: number,
        public video_link?: string,
        public backers?: number,
        public founded?: number,
        public collaborators?: string[],
        public genres?: string[],
        public artist?: GetArtists[],
        public venues?: GetVenue[],
        public venue?: AccountGetModel,
        public tickets?: TicketModel[],
        public event_season?:string,
        public image_base64?:string,
        public additional_cost?:number,
        public family_and_friends_amount?:number,
        public status?:string,
        public top_backers?:TopBackers[],
        public currency?:string
    )
    {}

    public static GetEventLocation(event: any)
    {
        let arr = [];

        if(event.venue)
        {
            if(event.venue.city)
                arr.push(event.venue.city);

            if(event.venue.state)
                arr.push(event.venue.state);

            if(event.venue.country)
                arr.push(event.venue.country);

            if(arr.length > 0)
                return arr.join(', ');
        }
        
        if(event.city)
            arr.push(event.city);

        if(event.state)
            arr.push(event.state);
        
        if(event.country)
            arr.push(event.country);

        if(arr.length > 0)
            return arr.join(', ');

        try { 
            var tokens: string[] = event.address.split(','); 
            for(const i in tokens)
            {
                tokens[i] = tokens[i].trim();
            }
            if(tokens.length == 6)
            {
                return tokens.slice(2,5).join(', ');
            }
            else if (tokens.length == 5) 
            { 
                return tokens[4].trim() + ',' + 
                tokens[3].trim() + ', ' + tokens[2].trim() + ', ' + tokens[0].trim() + ',' + 
                tokens[1].trim(); 
            } 
            else if (tokens.length == 4) 
            { 
                return tokens[3].trim() + ',' + 
                tokens[2].trim() + ', ' + tokens[0].trim() + ',' + 
                tokens[1].trim(); 
            } 
            else 
            { 
                return event.address; 
            } 
        } catch (ex)
        { 
            return event.address; 
        } 
    }

    public static GetDaysToGo(event: EventGetModel)
    {
        if(!event.is_crowdfunding_event)
            return 0;

        let result = parseInt((((new Date(event.funding_to?event.funding_to : event.exact_date_from)).getTime() - (new Date()).getTime())/1000/60/60/24).toFixed(0));

        return result;
    }
}
export class TopBackers{
    constructor(
        public id?: number,
        public image_id?: number,
    )
    {}
}
export class GetArtists{
    constructor(
        public artist_id?: number,
        public reason?: string,
        public reason_text?: string,
        public status?: string,
        public image_base64?: string,
        public created_at?: string,
        public is_active?:boolean,
        public message_id?:number,
        public agreement?:{
             id?:number,
             price?:number,
             datetime_from?:string,
             datetime_to?:string,
             venue_event_id?:number,
             artist_event_id?:number,
             created_at?:string,
             updated_at?:string,
        },
        public artist?:{
            first_name?:string,
            last_name?:string,
            user_name?:string,
            image_id?:number,
            image_base64?:string
            is_hide_pricing_from_search?:boolean,
            price?:number

        },
        public approximate_price?:number,
        public price?:number,
        public currency?:string
    )
    {}
}
export class GetVenue{
    constructor(
        public venue_id?: number,
        public reason?: string,
        public reason_text?:string,
        public created_at?:string,
        public status?: string,
        public is_active?:boolean,
        public agreement?:{
            id?:number,
            price?:number,
            datetime_from?:string,
            datetime_to?:string,
            venue_event_id?:number,
            artist_event_id?:number,
            created_at?:string,
            updated_at?:string,
       },
       public venue?:{
            display_name?:string,
            user_name?:string,
            image_id?:number,
            image_base64?:string
            price?:number,
            capacity?:number
       },
       public approximate_price?:number,
       public price?:number,
       public currency?:string,
       public web_cite?:string
    )
    {}
}
