export class CommentEventModel{
    constructor(
        public id?:number,
        public event_id?:number,
        public fan_id?:number,
        public text?:string,
        public account?:Account,
        public created_at?:Date
    ){}
}

class Account{
    constructor(
        public account_type?:string,
        public full_name?: string,
        public image_id?: number,
        public user_name?: string,
        public address?:string        
    ){}
}