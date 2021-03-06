
export class AccountSearchModel{
    constructor(
        public text?: string,
        public type?: string,
        public price_from?: number,
        public price_to?: number,
        public address?: string,
        public lat?: number,
        public lng?: number,
        public capacity_from?: number,
        public capacity_to?: number,
        public types_of_space?: string[],
        public extended?: boolean,
        public sort_by_popularity?: boolean,
        public limit?: number,
        public offset?: number,
        public genres?: string[],
        public exclude_event_id?:number
){}
}
