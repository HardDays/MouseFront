export class EventCreateModel{
    constructor(
        public account_id?:number,
        public name?:string,
        public image_base64?:string,
        public video_link?:string,
        public tagline?:string,
        public description?:string,
        public funding_goal?:number,
        public event_length?:number,
        public event_time?:string,
        public event_month?:number,
        public event_year?:string,
        public is_crowdfunding_event?:boolean,
        public city_lat?:number,
        public city_lng?:number,
        public address?:string,
        public artists_number?:number,
        public genres?:string[]
    )
    {}
}