import { AccountGetModel } from "./accountGet.model";

interface Sender {
    account_type:string,
    full_name:string,
    image_id:number,
    image_base64:string,
    user_name:string,
    display_name:string
}

interface MessageInfo {
    rate_score?:number,
    feedback_type?:string,
    is_forwarded?:boolean
}

export class FeedbackAdminModel{
    constructor(
        public id?:number,
        public created_at?:string,
        public message?: string,
        public message_info?: MessageInfo,
        public sender?:Sender,
        public sender_id?:number,
        public reply?:any,
        public feedback_type?:string
    ){

    }
}
