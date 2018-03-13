export class ArtistAddToEventModel{
    constructor(
        public id?:number,
        public account_id?:number,
        public artist_id?:number,
        public time_frame?:string,
        public is_personal?:boolean,
        public estimated_price?:number,
        public message?:string
    ){     
    }
}