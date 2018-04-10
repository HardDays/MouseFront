import { AccountType } from '../base/base.enum';
import { EventDateModel } from './eventDate.model';
import { ContactModel } from './contact.model';
import { WorkingTimeModel } from './workingTime.model';
import { Base64ImageModel } from './base64image.model';
import { GenreModel } from './genres.model';
export class AccountCreateModel{
    constructor(
            public user_name?: string,	
            public display_name?: string,
            public phone?: string,	
            public account_type?: string,
        public bio?: string, // fan
            public genres?: string[],
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
            public lighting_description?: string,
            public stage_description?: string,
            public lat?: number,
            public lng?: number,
            public dates?: EventDateModel[], 
            public emails?: ContactModel[],
            public office_hours?: WorkingTimeModel[],
            public operating_hours?: WorkingTimeModel[],
        public about?: string, //artist
            public video_links?: string[],
            public venue_video_links?: string[],
            public image_base64?:string

){}
}