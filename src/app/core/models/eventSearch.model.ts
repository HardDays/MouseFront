import { GenreModel } from './genres.model';
export class EventSearchModel{
    constructor(
        public text?: string,
        public location?: string,
        public lat?: number,
        public lng?: number,
        public distance?: number,
        public from_date?: string,
        public to_date?: string,
        public is_active?: boolean,
        public genres?: GenreModel[],
        public ticket_types?:string[],
        public limit?:number,
        public offset?:number
    )
    {}
}