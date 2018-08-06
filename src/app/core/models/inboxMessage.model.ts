import { EventGetModel } from "./eventGet.model";

interface Sender{
    image_id: number,
    image_base64:string,
    user_name: string,
    account_type: string,
    full_name: string
}

export class InboxMessageModel{
    constructor(
           public id?: number,
           public receiver_id?:number,
           public message_type?:string,
           public message?:string,
           public message_id?:number,
           public subject?:string,
           public created_at?:string,
        //    public updated_at?:string,
        //    public name?:string,
         
           public is_read?:boolean,
        //    public simple_message?:any,
           public message_info?: MessageInfoModel,
            public sender_id?:number,
           public sender?: Sender,

           public reply?:any[]
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
        public time_frame_range?:string,
        public time_frame_number?:number,
        public message?: string,
        public expiration_date?:string,
        public status?:string,
        public currency?:string
    ){}
}