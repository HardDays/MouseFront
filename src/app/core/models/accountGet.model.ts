import { AccountType } from '../base/base.enum';
import { EventDateModel } from './eventDate.model';
import { ContactModel } from './contact.model';
import { WorkingTimeModel } from './workingTime.model';
import { GenreModel } from './genres.model';
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
        public prefered_address?: string,
        public description?: string,
        public fax?: string,
        public bank_name?: string,
        public account_bank_number?: string,
        public account_bank_routing_number?: string,
        public capacity?: number,
        public num_of_bathrooms?: number,
        public min_age?: number,
        public venue_type?: string,
        public type_of_space?: string,
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
        public dates?: EventDateModel[], 
        public emails?: ContactModel[],
        public office_hours?: WorkingTimeModel[],
        public operating_hours?: WorkingTimeModel[],
        public about?: string,
        public stage_name?: string,
        public email?: string,
        public manager_name?: string,
        public video_links?: string[],
        public artist_albums?: Album[],
        public artist_videos?: Video[],
        public image_base64_not_given?: string
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
){}
}