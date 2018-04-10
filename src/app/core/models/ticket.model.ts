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
        public category?:string,
        public is_for_personal_use?:boolean
        
){}
}