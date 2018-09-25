export class TicketModel{
    constructor(
        public id?:number,
        public account_id?:number,
        public name?:string,
        public description?:string,
        public price?:number,
        public count?:number,
        public is_promotional?:boolean,
        public event_id?:number,
        public type?:string,
        // public category?:string,
        public is_for_personal_use?:boolean,
        public promotional_description?: string,
        public promotional_date_from?: string,
        public promotional_date_to?: string,
        public currency?:string,
        public original_price?: number,
        public tickets_left?: number
        
){}
}