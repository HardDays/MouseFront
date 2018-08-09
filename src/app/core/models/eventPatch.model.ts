import { AccountGetModel } from "./accountGet.model";
import { TicketModel } from "./ticket.model";

export class EventPatchModel{
    constructor(
        public id?: number,
        public account_id?: number,
        public name?: string,
        public tagline?: string,
        public description?: string,
        public funding_from?: string,
        public funding_to?: string,
        public funding_goal?: number,
        public creator_id?: number,
        public created_at?: string,
        public updated_at?: string,
        public is_active?: boolean,
        public views?: number,
        public artists?: string,
        public clicks?: number,
        public has_vr?: boolean,
        public has_in_person?: boolean,
        public updates_available?: boolean,
        public comments_available?: boolean,
        public date_from?: string,
        public date_to?: string,
        public event_month?: string,
        public event_year?: string,
        public event_length?: string,
        public event_time?: string,
        public is_crowdfunding_event?: boolean,
        public city_lat?: number,
        public city_lng?: number,
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

        public currency?:string
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
        public currency?:string
    )
    {}
}
export class GetVenue{
    constructor(
        public venue_id?: number,
        public reason?: string,
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
            price?:number
       },
       public approximate_price?:number,
       public currency?:string
    )
    {}
}