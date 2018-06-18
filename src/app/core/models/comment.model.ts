export class CommentModel{
    constructor(
        public event_id?:number,
        public account_id?:number,
        public text?:string,
        public account?:Account,
        public created_at?:Date
    ){}
}

class Account{
    constructor(
        public id?: number,
        public image_id?: number,
        public user_name?: string,
        public display_name?: string,
        public image_base64?:string
    ){}
}