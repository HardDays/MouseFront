import { AccountType } from '../base/base.enum';
import { EventDateModel } from './eventDate.model';
import { ContactModel } from './contact.model';
import { WorkingTimeModel } from './workingTime.model';
import { GengreModel } from './genres.model';
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
        public num_of_bathrooms?: number,
        public min_age?: number,
        public venue_type?: number,
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
        public about?: string
){}
}