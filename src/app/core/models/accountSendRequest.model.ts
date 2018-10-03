export class AccountSendRequestModel{
    constructor(
        public id?:number,
        public event_id?:number,
        public price?:number,
        public preferred_date_from?: string,
        public preferred_date_to?: string,
        public message_id?:number,
        public message?:string,
        public currency?:string,
    ){
    }
}
