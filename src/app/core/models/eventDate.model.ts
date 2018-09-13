export class EventDateModel{
    // 'booking_notice': 'same_day|one_day|two_seven_days'
    constructor(
        public begin_date?:string,
        public end_date?:string,
        public is_available?:Boolean,
        public price?:number,
        public booking_notice?:string
    )
    {}
}