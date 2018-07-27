import { AccountType } from '../base/base.enum';
import { EventDateModel } from './eventDate.model';
import { ContactModel } from './contact.model';
import { WorkingTimeModel } from './workingTime.model';
import { GenreModel } from './genres.model';
import { VenueDatesModel } from './venueDatesModel';
export class AccountGetModel{
    constructor(
        public id?: number,
        public user_name?: string,
        public display_name?: string,
        public phone?: string,
        public genres?: string[],
        public created_at?: string,
        public updated_at?: string,
        public image_id?: number,
        public account_type?: AccountType,
        public bio?: string,
        public address?: string,
        public description?: string,
        public fax?: string,
        public bank_name?: string,
        public account_bank_number?: string,
        public account_bank_routing_number?: string,
        public capacity?: number,
        public vr_capacity?: number,
        public num_of_bathrooms?: number,
        public min_age?: number,
        public venue_type?: string,
        public type_of_space?: string,
        public other_genre_description?:string,
        public has_bar?: boolean,
        public located?: string,
        public dress_code?: string,
        public has_vr?: boolean,
        public audio_description?: string,
        public audio_links?: Audio[],
        public lighting_description?: string,
        public stage_description?: string,
        public lat?: number,
        public lng?: number,
        public dates?: EventDateModel[] | VenueDatesModel[], 
        public emails?: ContactModel[],
        public first_name?:string,
        public last_name?:string,
        public country?: string,
        public city?:string,
        public state?:string,
        public zipcode?:string,

        public minimum_notice?:number,
        public is_flexible?:boolean,
        public price_for_daytime?:number,
        public price_for_nighttime?:number,
        public performance_time_from?: string,
        public performance_time_to?:string,

        public office_hours?: WorkingTimeModel[],
        public operating_hours?: WorkingTimeModel[],
        public about?: string,
        public stage_name?: string,
        public email?: string,
        public manager_name?: string,
        public video_links?: string[],
        public artist_albums?: Album[],
        public videos?: Video[],
        public artist_videos?: Video[],
        public image_base64_not_given?: string,
        public status_not_given?: string,
        public status?: string,


        public performance_min_time?:number,
        public performance_max_time?:number,
        public price_from?:number,
        public price_to?:number,
        public additional_hours_price?:number,
        public is_hide_pricing_from_profile?:boolean,
        public is_hide_pricing_from_search?:boolean,
        public is_perform_with_band?:boolean,
        public can_perform_without_band?:boolean,
        public is_perform_with_backing_vocals?:boolean,
        public can_perform_without_backing_vocals?:boolean,
        public preferred_venues?:{type_of_venue:string}[],
        public preferred_address?:string,
        public location?:string,
        public preferred_venue_text?:string,
        public days_to_travel?:number,
        public is_permitted_to_stream?:boolean,
        public is_permitted_to_advertisement?:boolean,
        public has_conflict_contracts?:boolean,
        public conflict_companies_names?:string,
        public min_time_to_book?:number,
        public min_time_to_free_cancel?:number,
        public late_cancellation_fee?:number,
        public refund_policy?:string,
        public artist_email?:string,
        public artist_riders?:Rider[],

        public followers_count?: number,
        public following_count?: number,
        public is_verified?: boolean,
        public events_dates?:any[],
        public available_dates?:any,
        public disable_dates?:any,

        public processed_by?:string
        
){}
}

export class Audio{
    constructor(
    public song_name?:string,
    public album_name?:string,
    public audio_link?:string,
){}
}
export class Album{
    constructor(
    public album_artwork?:string,
    public album_name?:string,
    public album_link?:string,
){}
}

export class Video{
    constructor(
    public album_name?:string,
    public name?:string,
    public link?:string,
    public preview?:string
){}
}
export class Rider{
    constructor(
        public rider_type?:string,//stage|backstage|hospitality|technical'
        public uploaded_file?:File,
        public uploaded_file_base64?:string,
        public description?:string,
        public is_flexible?:boolean,
        public id?:number
){}
}