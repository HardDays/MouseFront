export class VenueDatesModel
{
    constructor(
        public date?: Date,
        public price_for_daytime?: number,
        public price_for_nighttime?: number,
        public is_available?: Boolean
    ){}
}