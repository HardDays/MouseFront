export class FeedbackModel{
    constructor(
        public feedback_type?:string,
        public detail?: string,
        public rate_score?:string,
        public account_id?:number
    ){

    }
}