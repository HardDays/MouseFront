export class EventSearchParams{
    constructor(
        public text?:string,
        public location?:string,
        public lat?:number,
        public lng?:number,
        public distance?:number,
        public from_date?:string,
        public to_date?:string,
        public is_active?: boolean,
        public genres?: string[],
        public ticket_types?:string[],
        public limit?: number,
        public size?: string,
        public offset?: number
    ){
        if(!limit)
            this.limit = 21;
    }
}