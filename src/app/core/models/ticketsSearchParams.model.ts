export class TicketsSearchParams{
    constructor(
        public account_id?:number,
        public time?: string,
        public genres?: string[],
        public ticket_types?:string[],
        public location?:string,
        public date_from?:string,
        public date_to?:string,
        public limit?: number,
        public offset?: number
        
    ){
        /*if(!limit)
            this.limit = 21;*/

    }
}