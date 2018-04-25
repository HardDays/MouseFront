export class AccountSendRequestModel{
    constructor(
        public id?:number,
        public event_id?:number,
        public price?:number,
        public preferred_date_from?: Date,
        public preferred_date_to?: Date,
        public message_id?:number,
        public message?:string
    ){     
    }
}