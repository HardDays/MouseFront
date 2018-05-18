export class EventSearchParams{
    constructor(
        public text?:string,
        public is_active?: boolean,
        public location?:string,
        public lat?:number,
        public lng?:number,
        public distance?:number,
        public from_date?:string,
        public to_date?:string,
        public genres?: string[],
        public ticket_types?:string[],
        public size?:string[],
        public only_my?:boolean,
        public account_id?:number,
        public limit?: number,
        public offset?: number
    ){

    }
}