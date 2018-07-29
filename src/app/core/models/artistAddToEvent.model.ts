export class AccountAddToEventModel{
    constructor(
        public event_id?:number,
        public account_id?:number,
        public artist_id?:number,
        public venue_id?:number,
        public id?:number,
        public message_id?:number,
        public time_frame_range?:string,
        public time_frame_number?:number,
        public is_personal?:boolean,
        public estimated_price?:number,
        public message?:string
    ){     
    }
}