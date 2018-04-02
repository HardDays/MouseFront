import { TicketModel } from "./ticket.model";

export class EventGetModel{
    constructor(
        public id?: number,
        public name?: string,
        public tagline?: string,
        public description?: string,
        public funding_from?: string,
        public funding_to?: string,
        public funding_goal?: string,
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
        public date_from?: string,
        public date_to?: string,
        public event_month?: string,
        public event_year?: string,
        public event_length?: string,
        public event_time?: string,
        public is_crowdfunding_event?: boolean,
        public city_lat?: string,
        public city_lng?: string,
        public artists_number?: number,
        public address?: string,
        public image_id?: number,
        public video_link?: string,
        public backers?: number,
        public founded?: number,
        public collaborators?: string[],
        public genres?: string[],
        public artist?: GetArtists[],
        public venue?: GetVenue[],
        public tickets?: TicketModel[]
    )
    {}
}

export class GetArtists{
    constructor(
        public artist_id?: number,
        public reason?: string,
        public status?: string
    )
    {}
}
export class GetVenue{
    constructor(
        public venue_id?: number,
        public reason?: string,
        public status?: string
    )
    {}
}