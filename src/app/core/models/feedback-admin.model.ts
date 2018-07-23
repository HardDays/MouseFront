import { AccountGetModel } from "./accountGet.model";

export class FeedbackAdminModel{
    constructor(
        public id?:number,
        public feedback_type?:string,
        public created_at?:string,
        public detail?: string,
        public rate_score?:number,
        public account?:AccountGetModel,
        public reply?:any
    ){

    }
}