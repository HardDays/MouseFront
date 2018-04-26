import { EventGetModel } from "./eventGet.model";

export class InboxMessageModel{
    constructor(
           public id?: number,
           public receiver_id?:number,
           public message_type?:string,
           public created_at?:string,
           public updated_at?:string,
           public name?:string,
           public sender_id?:number,
           public is_read?:boolean,
           public simple_message?:any,
           public message_info?: MessageInfoModel,
         
    ){}
}

export class MessageInfoModel{
    constructor(
        public preferred_date_from?:string,
        public preferred_date_to?:string,
        public price?:number,
        public travel_price?:number,
        public hotel_price?:number,
        public transportation_price?:number,
        public band_price?:number,
        public other_price?:number,
        public created_at?:string,
        public updated_at?:string,
        public inbox_message_id?:number,
        public event_info?:EventGetModel,
        public estimated_price?:number,
        public time_frame?:string,
        public message?: string
    ){}
}