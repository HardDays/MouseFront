export class FeedbackModel{
    constructor(
        public feedback_type?:string,
        public message?: string,
        public rate_score?:string,
        public account_id?:number
    ){

    }
}