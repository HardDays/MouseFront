export class AccountSearchParams{
    constructor(
        public text?:string,
        public type?:string,
        public price_from?:number,
        public price_to?:number,
        public address?:string,
        public capacity_from?:number,
        public capacity_to?:number,
        public genres?: string[],
        public limit?: number,
        public offste?: number,
        public type_of_space?: string,
        public extended?: boolean
    ){
        if(!limit)
            this.limit = 21;

        if(!extended)
            this.extended = true;
        
    }
}